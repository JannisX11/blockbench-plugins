Plugin.register('json_minifier', {
    title: 'JSON压缩',
    author: 'XXQY',
    description: '导出JSON时自动极限压缩，移除所有空白和冗余',
    icon: 'fa-compress',
    version: '1.0.0',
    min_version: '4.0.0',
    variant: 'both',
    
    onload() {
        // 保存原始函数
        this._originalExport = Blockbench.export;
        this._originalCodecs = {};
        
        // 拦截 Blockbench.export
        Blockbench.export = (options) => {
            if (options && options.content && typeof options.content === 'string') {
                let t = options.content.trim();
                if (t.startsWith('{') || t.startsWith('[')) {
                    try {
                        let obj = JSON.parse(t);
                        options.content = minifyJSON(obj);
                    } catch(e) {}
                }
            }
            return this._originalExport.call(Blockbench, options);
        };
        for (let id in Codecs) {
            let codec = Codecs[id];
            if (codec && typeof codec.compile === 'function') {
                this._originalCodecs[id] = codec.compile.bind(codec);
                (function(originalCompile, codecRef) {
                    codecRef.compile = function(...args) {
                        let result = originalCompile.apply(this, args);
                        if (result && typeof result === 'object') {
                            return minifyJSON(result);
                        }
                        if (typeof result === 'string') {
                            let t = result.trim();
                            if (t.startsWith('{') || t.startsWith('[')) {
                                try {
                                    return minifyJSON(JSON.parse(t));
                                } catch(e) {}
                            }
                        }
                        return result;
                    };
                })(this._originalCodecs[id], codec);
            }
        }
        
        Blockbench.showQuickMessage('JSON压缩插件已加载 - XXQY');
    },
    
    onunload() {
        if (this._originalExport) {
            Blockbench.export = this._originalExport;
        }
        for (let id in this._originalCodecs) {
            if (Codecs[id]) {
                Codecs[id].compile = this._originalCodecs[id];
            }
        }
        Blockbench.showQuickMessage('JSON压缩插件已卸载');
    }
});

function minifyJSON(obj) {
    function walk(value) {
        if (typeof value === 'number') {
            if (value === 0) return 0;
            if (value === Math.floor(value)) return Math.floor(value);
            let str = value.toString();
            if (str.indexOf('.') !== -1) {
                str = str.replace(/\.?0+$/, '');
                let num = parseFloat(str);
                if (!isNaN(num)) return num;
            }
            return value;
        }
        if (Array.isArray(value)) {
            return value.map(walk);
        }
        if (value !== null && typeof value === 'object') {
            let sorted = {};
            Object.keys(value).sort().forEach(function(k) {
                sorted[k] = walk(value[k]);
            });
            return sorted;
        }
        return value;
    }
    
    try {
        let processed = walk(obj);
        return JSON.stringify(processed);
    } catch(e) {
        return JSON.stringify(obj);
    }
}
