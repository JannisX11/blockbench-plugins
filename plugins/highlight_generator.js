(function(){
    let button;

    Plugin.register('highlight_generator', {
        title: 'Highlight Mod Shape Generator',
        author: 'ThatGravyBoat',
        description: 'Generates Shape JSONs for the Highlight mod. Mod can be found at: https://links.resourcefulbees.com/highlight',
        icon: 'fa-cube',
        version: '1.0.0',
        variant: 'both',
        tags: ["Minecraft: Java Edition"],
        onload(){
            button = new Action("export_highlight", {
                name : 'Export Highlight',
                description : 'Exports Highlight mod shape JSON',
                icon : 'fa-file-export',
                click: function(){
                    Blockbench.export({
                        type : 'Highlight Shape Export',
                        extensions: ['json'],
                        savetype: 'text',
                        content: generateFile()
                    });
                }
            });

            MenuBar.addAction(button, "file.export");
        },
        onunload(){
            button.delete();
        }
    });

})();

function generateFile(){
    let data = [];
    for (let cube of Cube.all) {
        const formattedLines = cube.getGlobalVertexPositions().map(point => point.map(value => value / 16.0));
        const convertedVertices = [
            [formattedLines[2], formattedLines[3], formattedLines[6], formattedLines[7]],
            [formattedLines[0], formattedLines[1], formattedLines[4], formattedLines[5]]
        ]

        for (let convertedVertex of convertedVertices) {
            for (let edge of createHorizontalEdges(convertedVertex)) {
                let topFace = []
                topFace.push(...edge[0])
                topFace.push(...edge[1])
                if (!data.includes(topFace)) {
                    data.push(topFace)
                }
            }
            data.push(null)
        }

        for (let edge of createVerticalEdges(convertedVertices[0], convertedVertices[1])) {
            let topFace = []
            topFace.push(...edge[0])
            topFace.push(...edge[1])
            if (!data.includes(topFace)) {
                data.push(topFace)
            }
        }
        data.push(null)
    }
    data.pop()
    // The json is formatted below like this so its easier to read as each "section" will be seperated by a newline.
    let output = `{\n    "lines": [\n`
    for (let datum of data) {
        if (datum == null) {
            output += `\n`
        } else {
            output += `        [${datum[0]}, ${datum[1]}, ${datum[2]}, ${datum[3]}, ${datum[4]}, ${datum[5]}],\n`
        }
    }
    return output.substr(0, output.length - 2) + `\n    \n}`;
}

function createHorizontalEdges(vertices) {
    return [[vertices[2], vertices[3]], [vertices[2], vertices[1]], [vertices[1], vertices[0]], [vertices[3], vertices[0]]]
}

function createVerticalEdges(top, bottom) {
    return [[bottom[3], top[3]], [bottom[2], top[2]], [bottom[1], top[1]], [bottom[0], top[0]]]
}