document.getElementById('render-button').addEventListener('click', handleMarkdownInput);

let mindmapData = {};

function handleMarkdownInput() {
    const markdown = document.getElementById('markdown-input').value;
    mindmapData = parseMarkdownToTree(markdown);
    renderRootNode();
}

function parseMarkdownToTree(markdown) {
    const lines = markdown.split('\n');
    const tree = { name: '', children: [] };
    let currentParent = tree;
    const stack = [tree];

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('#')) {
            const level = (trimmedLine.match(/#/g) || []).length;
            const nodeName = trimmedLine.replace(/#/g, '').trim();
            const newNode = { name: nodeName, children: [] };

            if (level === 1) {
                tree.name = nodeName;
            } else {
                while (stack.length >= level) {
                    stack.pop();
                }
                const parent = stack[stack.length - 1];
                parent.children.push(newNode);
            }

            stack.push(newNode);
        } else if (trimmedLine.length > 0) {
            const lastNode = stack[stack.length - 1];
            const textNode = { name: trimmedLine, children: [] };
            lastNode.children.push(textNode);
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
