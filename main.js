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

function processChildNode(parent, node) {
    var treeNode = ('parent' in parent)
        // parent is node 
        ? parent.createChildNode(node.title, false, choiceIcon(node), node.url, 
            node.url ? 'bookmark_context_menu' : 'folder_context_menu')
        // parent is tree
        : parent.createNode(node.title, false, choiceIcon(node), null, null, 'first_level_folder_context_menu');
    var curProcessChildNode = processChildNode.bind(null, treeNode);
    if (node.children) {
        node.children.forEach(curProcessChildNode);
    }
}

function choiceIcon(node) {
    var icon = node.url ? 'chrome://favicon/' + node.url : 'images/folder.png';
    return icon;
}

function openUrl(node) {
    if (node.tag) {
        chrome.tabs.create({
            url: node.tag
        });
    }
}

function generateContextMenu() {
    var enableAutoExpandMenuItem = 
    { 
        text: 'Enable auto expand',
        icon: 'images/expand.png',
        action: function(node) {}
    };
    var disableAutoExpandMenuItem = 
    { 
        text: 'Disable auto expand',
        icon: 'images/expand.png',
        action: function(node) {}
    };    
    var enableAutoHideMenuItem = 
    { 
        text: 'Enable auto hide',
        icon: 'images/expand.png',
        action: function(node) {}
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