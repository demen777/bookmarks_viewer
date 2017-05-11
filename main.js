showTree();

function showTree() {
    chrome.bookmarks.getTree(handleGetTree);
}

function handleGetTree(bookmarkTreeNodes) {
    var context_menu = generateContextMenu();
    var tree = createTree('div_tree', 'white', context_menu);
    tree.doubleClickNode = openUrl;
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

function openUrl(treeNode) {
    if (treeNode.tag.url) {
        chrome.tabs.create({
            url: treeNode.tag.url
        });
    }
}


function generateContextMenu() {
    var backgroundPage = chrome.extension.getBackgroundPage();
    var enableAutoExpandMenuItem = 
    { 
        text: 'Enable auto expand',
        icon: null,
        action: backgroundPage.enableAutoExpand
    };
    var disableAutoExpandMenuItem = 
    { 
        text: 'Disable auto expand',
        icon: null,
        action: backgroundPage.disableAutoExpand
    };
    var enableAutoHideMenuItem = 
    { 
        text: 'Enable auto hide',
        icon: null,
        action: backgroundPage.hide
    };
    var res = 
    {
        'first_level_folder_context_menu': {
            elements: [
                enableAutoExpandMenuItem,
                disableAutoExpandMenuItem,
                enableAutoHideMenuItem
            ]
        },
        'folder_context_menu': {
            elements: [
                enableAutoExpandMenuItem,
                disableAutoExpandMenuItem
            ]
        },
        'bookmark_context_menu': {
            elements: []
        }
    };
    return res;
}