(function(){
    var root,lastnav,
        list = $('.j-flag'),
        frame = $('#content-frame').get(0),
        nnav = list[0],//主导航
        nsnav = list[1];//侧栏导航
    /**
     * 初始化
     */
    function init(){
        $.getJSON('/webdoc/docs/hierarchy.json', onHierarchyLoad);
        //$(nnav).click(onNavClick);

    };
    /**
     * hash变化回调
     * @param hash
     */
    function onHashChange(hash){
        hash = decodeURIComponent(hash);
        var splits = hash.split('/'),
            mnav = splits.shift(),
            navs = $('a', nnav),
            sdata = getNodeData(mnav);
        navs.each(function(index, item){
            item = $(item);
            var href = item.attr('href');
            if(href&&getRoot(href)==mnav){
                item.addClass('z-sel');
            }else{
                item.removeClass('z-sel');
            }
        });
        if(lastnav!=mnav&&sdata){
            lastnav = mnav;
            $.jstree.destroy();
            $(nsnav).jstree({ 'core' : {
                'data' : formatList(sdata.childs||[], hash)
            } }).on('changed.jstree', function(e, data){
                if(!data.node||!data.node.original) return;
                var link = data.node.original.link;
                if(link){
                    location.hash = formatPath(link);
                }
            });
        }
        if(/\.html$/.test(hash)){
            frame.contentWindow.location.replace('/webdoc/docs/'+hash);
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
            htmls.push(tpl.process({href:item.childs&&item.childs.length?(getFistLink(item.childs)||formatPath(item.path)):null, name:item.name}));
        });
        nnav.innerHTML = htmls.join('');
        if(!location.hash) location.hash = getFistLink(result[0].childs)||result[0].name;
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
    function formatList(nodes, hash){
        var list = nodes.slice(0);
        for(var i=0,ii;i<list.length;i++){
            ii = list[i];
            ii.text = ii.name.replace(/\.html$/, '');
            ii.children = ii.childs;
            ii.state = ii.state||{};
            if(ii.link){
                ii['a_attr'] = {href:'#'+formatPath(ii.link)};
                ii.icon = 'jstree-file';
                ii.state.disabled = false;
                ii.state.selected = hash==formatPath(ii.link);
            }else{
                ii.state.disabled = true;
            }
            if(ii.childs&&ii.childs.length){
                ii.state.opened = true;
                Array.prototype.push.apply(list, ii.childs);
            }
        }
        return nodes;
    };
    function getFistLink(childs){
        var list = childs.slice(0);
        for(var i= 0,ii;i<list.length;i++){
            ii = list[i];
            if(ii.link){
                return formatPath(ii.link);
            }
            if(ii.childs&&ii.childs.length){
                Array.prototype.push.apply(list, ii.childs);
            }
        }
    };
    function getRoot(path){
        return path.split('/')[0].replace('#', '');
    };
    //初始化
    init();
})();