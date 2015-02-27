(function(){
    var navMap = {},
        list = $('.j-flag'),
        nnav = list[0],
        nsnav = list[1];
    $.getJSON('/webdoc/build/docs/hierarchy.json', onJsonLoad);
    function onJsonLoad(result){
        var htmls = [];
        result.forEach(function(item){
            var key = Math.round(Math.random()*1000000);
            htmls.push(merge('<li><a data-id="{0}">{1}</a></li>', key, item.name));
            navMap[key] = item.childs;
        });
        nnav.innerHTML = htmls.join('');
        $(nnav).click(onNavClick);
    };
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
    function onNavClick(event){
        var node = event.srcElement;
        if(node.tagName.toLowerCase()=='a'){
            var navs = $('a', nnav);
            navs.each(function(index, item){
                $(item).removeClass('z-sel');
            });
            $(node).addClass('z-sel');
            switchNav(node.dataset.id);
        }
    };
    function switchNav(id){
        var data = navMap[id];
        nsnav.innerHTML = showList(data, 1);
    };
    function showList(list, depth){
        var htmls = [],
            tpl = '<h{0}><a target="content" href="{1}">{2}</a></h{0}>';
        list.forEach(function(item){
            htmls.push(merge(tpl, depth, item.link||'', item.name));
            htmls.push(showList(item.childs, depth+1));
        });
        return htmls.join('');
    };
})();