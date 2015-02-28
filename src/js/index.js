(function(){
    var root,
        list = $('.j-flag'),
        frame = $('#content-frame').get(0),
        nnav = list[0],//主导航
        nsnav = list[1];//侧栏导航
    /**
     * 初始化
     */
    function init(){
        $.getJSON('/docs/hierarchy.json', onHierarchyLoad);
        //$(nnav).click(onNavClick);

    };
    /**
     * hash变化回调
     * @param hash
     */
    function onHashChange(hash){
        var splits = hash.split('/'),
            mnav = splits.shift(),
            navs = $('a', nnav),
            sdata = getNodeData(mnav);
        navs.each(function(index, item){
            item = $(item);
            var href = item.attr('href');
            if(href&&href.substring(1)==mnav){
                item.addClass('z-sel');
            }else{
                item.removeClass('z-sel');
            }
        });
        if(sdata){
            nsnav.innerHTML = showList(sdata.childs, 1);
        }
        if(/\.html$/.test(hash)){
            frame.contentWindow.location.replace('/docs/'+hash);
        }else{
            frame.contentWindow.location.replace('about:blank');
        }
    };
    /**
     * 层级数据加载完回调
     * @param result
     */
    function onHierarchyLoad(result){
        root = {childs:result};
        //渲染主导航
        var htmls = [],
            tpl = TrimPath.parseTemplate('<li><a {if href} href="#${href}"{/if}>${name}</a></li>');
        result.forEach(function(item){
            htmls.push(tpl.process({href:item.childs&&item.childs.length?formatPath(item.path):null, name:item.name}));
        });
        nnav.innerHTML = htmls.join('');
        Hash.init(onHashChange);
    };
    function showList(list, depth){
        var htmls = [],
            tpl = TrimPath.parseTemplate('<h${depth}><a {if href} href="#${href}"{/if}>${name}</a></h${depth}>');
        list.forEach(function(item){
            htmls.push(tpl.process({depth:depth, href:formatPath(item.link), name:item.name}));
            htmls.push(showList(item.childs, depth+1));
        });
        return htmls.join('');
    };
    /**
     * 模版合并
     * @returns {*}
     */
    function merge(){
        var _args = Array.prototype.slice.call(arguments,0),
            _tpl = _args.shift();
        if(_tpl){
            return _tpl.replace(/{(\d+)}/g,function($1,$2){
                return $2<_args.length?_args[$2]:$1;
            });
        }
        return '';
    };
    /**
     * 获取路径下的数据
     */
    function getNodeData(path){
        var all = [root];
        if(!path) return root;
        for(var i=0,ii;i<all.length;i++){
            ii = all[i];
            if(formatPath(ii.path)===path) return ii;
            if(ii.childs&&ii.childs.length){
                Array.prototype.push.apply(all, ii.childs);
            }
        }

    };
    /**
     * 格式化路径
     * @param path
     * @returns {*}
     */
    function formatPath(path){
        if(/docs\/(.+)/.test(path)){
            return RegExp.$1;
        }
        return path;
    };
    //初始化
    init();
})();