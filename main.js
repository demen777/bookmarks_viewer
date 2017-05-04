showTree();

function showTree() {
    chrome.bookmarks.getTree(handleGetTree);
}

function handleGetTree(bookmarkTreeNodes) {
    var tree = createTree('div_tree', 'white');
    tree.doubleClickNode = openUrl;
    if (bookmarkTreeNodes[0].children != undefined) {
        bookmarkTreeNodes[0].children.forEach(function(node) {
            var curTreeNode = tree.createNode(node.title, false, 'images/folder.png', null, null, null);
            var curProcessChildNode = processChildNode.bind(curTreeNode);
            if (node.children != undefined) {
                node.children.forEach(curProcessChildNode);
            }
        })
    }
    tree.drawTree();
}

function processChildNode(childNode) {
    var icon = childNode.url ? 'chrome://favicon/' + childNode.url : 'images/folder.png';
    treeChildNode = this.createChildNode(childNode.title, false, icon, childNode.url, null);
    var curProcessChildNode = processChildNode.bind(treeChildNode);
    if(childNode.children != undefined) {
        childNode.children.forEach(curProcessChildNode);
    }
}

function openUrl(node) {
    if (node.tag) {
        chrome.tabs.create({
            url: node.tag
        });
    }
}