var hiddenBookmarkSet = new Set();
var autoExpandedBookmarkSet = new Set();
chrome.storage.local.get(['autoExpandedBookmarkSet', 'hiddenBookmarkSet'], loadFromStorage);

function loadFromStorage(items) {
    if ('autoExpandedBookmarkSet' in items) {
        autoExpandedBookmarkSet = new Set(items['autoExpandedBookmarkSet']);
    }
    if ('hiddenBookmarkSet' in items) {
        hiddenBookmarkSet = new Set(items['hiddenBookmarkSet']);
    }
}

function enableAutoExpand(treeNode) {
    autoExpandedBookmarkSet.add(treeNode.tag.id);
    chrome.storage.local.set({'autoExpandedBookmarkSet': [...autoExpandedBookmarkSet]});
    treeNode.expandNode();
}

function disableAutoExpand(treeNode) {
    autoExpandedBookmarkSet.delete(treeNode.tag.id);
    chrome.storage.local.set({'autoExpandedBookmarkSet': [...autoExpandedBookmarkSet]});
}

function hide(treeNode) {
    hiddenBookmarkSet.add(treeNode.tag.id);
    chrome.storage.local.set({'hiddenBookmarkSet': [...hiddenBookmarkSet]});
    treeNode.removeNode();    
}