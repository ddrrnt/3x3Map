document.getElementById('render-button').addEventListener('click', handleMarkdownInput);

let mindmapData = {};

function handleMarkdownInput() {
    const markdown = document.getElementById('markdown-input').value;
    mindmapData = parseMarkdownToTree(markdown);
    renderRootNode();
}

function parseMarkdownToTree(markdown) {
    const lines = markdown.split('\n');
    const tree = { name: 'Crafting Effective Questions', children: [] };
    let currentParent = tree;
    let currentLevel = 1;

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('#')) {
            const level = (trimmedLine.match(/#/g) || []).length;
            const nodeName = trimmedLine.replace(/#/g, '').trim();
            const newNode = { name: nodeName, children: [] };
            if (level === 1) {
                currentParent = tree;
                currentParent.children.push(newNode);
            } else if (level === 2) {
                currentParent = tree.children[tree.children.length - 1];
                currentParent.children.push(newNode);
            } else if (level === 3) {
                const lastParent = currentParent.children[currentParent.children.length - 1];
                lastParent.children.push(newNode);
            }
        } else if (trimmedLine.match(/^\d+\./)) {
            const nodeName = trimmedLine.replace(/^\d+\./, '').trim();
            const newNode = { name: nodeName, children: [] };
            currentParent.children.push(newNode);
            currentParent = newNode;
            currentLevel = 2;
        } else if (trimmedLine.startsWith('-')) {
            const nodeName = trimmedLine.replace(/^-/, '').trim();
            const newNode = { name: nodeName, children: [] };
            if (currentLevel === 2) {
                currentParent.children.push(newNode);
            } else if (currentLevel === 3) {
                const lastParent = currentParent.children[currentParent.children.length - 1];
                lastParent.children.push(newNode);
            }
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
