document.getElementById('render-button').addEventListener('click', handleMarkdownInput);

let mindmapData = {};

function handleMarkdownInput() {
    const markdown = document.getElementById('markdown-input').value;
    mindmapData = parseMarkdownToTree(markdown);
    renderRootNode();
}

function parseMarkdownToTree(markdown) {
    const lines = markdown.split('\n');
    const tree = { name: 'Root Node', children: [] };
    let currentParent = tree;

    lines.forEach(line => {
        if (line.startsWith('# ')) {
            currentParent = tree;
            currentParent.children.push({ name: line.replace('# ', ''), children: [] });
        } else if (line.startsWith('## ')) {
            currentParent = tree.children[tree.children.length - 1];
            currentParent.children.push({ name: line.replace('## ', ''), children: [] });
        } else if (line.startsWith('### ')) {
            const lastParent = currentParent.children[currentParent.children.length - 1];
            lastParent.children.push({ name: line.replace('### ', ''), children: [] });
        }
    });

    return tree;
}

function renderRootNode() {
    const container = document.getElementById('mindmap-container');
    container.innerHTML = '';

    const rootNode = createNodeElement(mindmapData, 'root');
    container.appendChild(rootNode);
}

function createNodeElement(node, level) {
    const nodeElement = document.createElement('div');
    nodeElement.className = `node ${level}`;
    nodeElement.textContent = node.name;

    nodeElement.addEventListener('click', function() {
        if (node.children.length > 0) {
            renderChildNodes(node, level);
        }
    });

    return nodeElement;
}

function renderChildNodes(parentNode, parentLevel) {
    const container = document.getElementById('mindmap-container');
    container.innerHTML = '';

    const parentNodeElement = createNodeElement(parentNode, parentLevel);
    container.appendChild(parentNodeElement);

    const levels = { 'root': 'layer1', 'layer1': 'layer2' };
    const childLevel = levels[parentLevel];

    parentNode.children.forEach(childNode => {
        const childNodeElement = createNodeElement(childNode, childLevel);
        container.appendChild(childNodeElement);
    });
}
