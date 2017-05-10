showTree();

function showTree() {
    chrome.bookmarks.getTree(handleGetTree);
}

function handleGetTree(bookmarkTreeNodes) {
    var tree = createTree('div_tree', 'white');
    tree.doubleClickNode = openUrl;
    var curProcessChildNode = processChildNode.bind(null, tree);
    bookmarkTreeNodes[0].children.forEach(curProcessChildNode);
    tree.drawTree();
}

function processChildNode(parent, node) {
    var treeNode = ('parent' in parent)
        // parent is node 
        ? parent.createChildNode(node.title, false, choiceIcon(node), node.url, 'context1')
        // parent is tree
        : parent.createNode(node.title, false, choiceIcon(node), null, null, 'context1');
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
