showTree();

function showTree() {
    chrome.bookmarks.getTree(handleGetTree);
}

function handleGetTree(bookmarkTreeNodes) {
    var context_menu = generateContextMenu();
    var tree = createTree('div_tree', 'white', context_menu);
    tree.onSpanClick = clickNode;
    var curProcessChildNode = processChildNode.bind(null, tree);
    bookmarkTreeNodes[0].children.forEach(curProcessChildNode);
    tree.drawTree();
}

function processChildNode(parent, bookmarkNode) {
    var backgroundPage = chrome.extension.getBackgroundPage();
    if (backgroundPage.hiddenBookmarkSet.has(bookmarkNode.id)) {
        return;
    }
    var treeNode = ('parent' in parent)
        // parent is node 
        ? parent.createChildNode(bookmarkNode.title, backgroundPage.autoExpandedBookmarkSet.has(bookmarkNode.id), 
            choiceIcon(bookmarkNode), {id: bookmarkNode.id, url: bookmarkNode.url}, 
            bookmarkNode.url ? 'bookmark_context_menu' : 'folder_context_menu')
        // parent is tree
        : parent.createNode(bookmarkNode.title, backgroundPage.autoExpandedBookmarkSet.has(bookmarkNode.id), 
            choiceIcon(bookmarkNode), null,
            {id: bookmarkNode.id, url: bookmarkNode.url}, 'first_level_folder_context_menu');
    var curProcessChildNode = processChildNode.bind(null, treeNode);
    if (bookmarkNode.children) {
        bookmarkNode.children.forEach(curProcessChildNode);
    }
}

function choiceIcon(bookmarkNode) {
    var icon = bookmarkNode.url ? 'chrome://favicon/' + bookmarkNode.url : 'images/folder.png';
    return icon;
}

function clickNode(treeNode) {
    if (treeNode.tag.url) {
        openUrl(treeNode.tag.url);
    } else {
        treeNode.toggleNode();
    }
}

function openUrl(url) {
    chrome.tabs.create({
        url: url
    });
}

function deleteBookmark(treeNode) {
    var needDelete = confirm("Remove bookmark '" + treeNode.text + "'?");
    if (needDelete) {
        chrome.bookmarks.remove(treeNode.tag.id);
        treeNode.removeNode();
    }
}

function generateContextMenu() {
    var backgroundPage = chrome.extension.getBackgroundPage();
    var enableAutoExpandMenuItem = { 
        text: 'Autoexpand ON',
        icon: null,
        action: backgroundPage.enableAutoExpand
    };
    var disableAutoExpandMenuItem = { 
        text: 'Autoexpand OFF',
        icon: null,
        action: backgroundPage.disableAutoExpand
    };
    var enableAutoHideMenuItem = { 
        text: 'Hide folder',
        icon: null,
        action: backgroundPage.hide
    };
    var showAllHiddenMenuItem = {
        text: 'Show all hidden',
        icon: null,
        action: function () { backgroundPage.showAllHidden(); location.reload(); }
    }
    var deleteBookmarkMenuItem = {
        text: 'Delete bookmark',
        icon: null,
        action: deleteBookmark
    }
    var res = 
    {
        'first_level_folder_context_menu': {
            elements: [
                enableAutoExpandMenuItem,
                disableAutoExpandMenuItem,
                enableAutoHideMenuItem,
                showAllHiddenMenuItem
            ]
        },
        'folder_context_menu': {
            elements: [
                enableAutoExpandMenuItem,
                disableAutoExpandMenuItem
            ]
        },
        'bookmark_context_menu': {
            elements: [deleteBookmarkMenuItem]
        }
    };
    return res;
}