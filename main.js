showTree();

function showTree() {
    chrome.bookmarks.getTree(handleGetTree);
}

function processChildNode(treeParentNode, childNode) {
    var treeChildNode = treeParentNode.createChildNode(childNode.title, false, 'images/star.png', null, null);
    var curProcessChildNode = processChildNode.bind(null, treeChildNode);
    if(childNode.children != undefined) {
        childNode.children.forEach(curProcessChildNode);
    }
}

function handleGetTree(bookmarkTreeNodes) {
    var tree = createTree('div_tree','white');
    var i = 0;
    if (bookmarkTreeNodes[0].children != undefined) {
        bookmarkTreeNodes[0].children.forEach(function(node) {
            var curTreeNode = tree.createNode(node.title, false, 'images/star.png', null, null, null);
            var curProcessChildNode = processChildNode.bind(null, curTreeNode);
            if (node.children != undefined) {
                node.children.forEach(curProcessChildNode);
            }
        })
    }
    tree.drawTree();
}
