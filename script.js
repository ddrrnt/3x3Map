function parseMarkdown(markdown) {
    const lines = markdown.split('\n');
    const root = { content: lines[0].replace('# ', ''), children: [] };
    let currentLevel1 = null;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('## ')) {
            currentLevel1 = { content: line.replace('## ', ''), children: [] };
            root.children.push(currentLevel1);
        } else if (line.startsWith('### ') && currentLevel1) {
            currentLevel1.children.push({ content: line.replace('### ', '') });
        }
    }

    return root;
}

function createNode(content, level, id = '') {
    const node = document.createElement('div');
    node.className = `node level-${level}`;
    node.textContent = content;
    if (id) node.id = id;
    return node;
}

function renderMindmap(data) {
    const container = document.getElementById('mindmap-container');
    container.innerHTML = '';

    const rootNode = createNode(data.content, 0, 'root');
    rootNode.classList.add('root');
    container.appendChild(rootNode);

    const level2Positions = [
        [[4, 1], [4, 2], [3, 2]],  // For level-1-1
        [[4, 3], [4, 4], [3, 4]],  // For level-1-2
        [[1, 4], [2, 4], [2, 3]]   // For level-1-3
    ];

    data.children.forEach((child, index) => {
        if (index >= 3) return; // Limit to 3 level 1 nodes

        const childNode = createNode(child.content, 1, `level-1-${index + 1}`);
        container.appendChild(childNode);

        child.children.forEach((grandchild, grandchildIndex) => {
            if (grandchildIndex >= 3) return; // Limit to 3 level 2 nodes
            const position = level2Positions[index][grandchildIndex];
            const grandchildNode = createNode(grandchild.content, 2);
            grandchildNode.style.gridArea = `${position[0]} / ${position[1]} / span 1 / span 1`;
            container.appendChild(grandchildNode);
        });

        childNode.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLevel2Nodes(index);
        });
    });

    rootNode.addEventListener('click', toggleLevel1Nodes);
}

function toggleLevel1Nodes() {
    const level1Nodes = document.querySelectorAll('.level-1');
    const level2Nodes = document.querySelectorAll('.level-2');
    const displayStyle = level1Nodes[0].style.display === 'none' ? 'flex' : 'none';
    
    level1Nodes.forEach(node => node.style.display = displayStyle);
    if (displayStyle === 'none') {
        level2Nodes.forEach(node => node.style.display = 'none');
    }
}

function toggleLevel2Nodes(index) {
    const level2Positions = [
        [[4, 1], [4, 2], [3, 2]],  // For level-1-1
        [[4, 3], [4, 4], [3, 4]],  // For level-1-2
        [[1, 4], [2, 4], [2, 3]]   // For level-1-3
    ];

    const l2Nodes = document.querySelectorAll('.level-2');
    l2Nodes.forEach(node => {
        if (level2Positions[index].some(pos => node.style.gridArea.startsWith(`${pos[0]} / ${pos[1]}`))) {
            node.style.display = node.style.display === 'none' ? 'flex' : 'none';
        }
    });
}

document.getElementById('render-button').addEventListener('click', () => {
    const markdown = document.getElementById('input-area').value;
    const data = parseMarkdown(markdown);
    renderMindmap(data);
});
