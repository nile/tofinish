/**
 * Created with IntelliJ IDEA.
 * User: nile
 * Date: 12-4-18
 * Time: 下午10:16
 * To change this template use File | Settings | File Templates.
 */
var T = function (options) {
    var defaults = {
        login_url: '',
        list_boards_url:'',
        view_board_url:'',
        create_board_url:'',
        view_list_url:'',
        save_card_url:'',
        delete_card_url: "",
        view_comments_url:'',
        create_comment_url:'',
        delete_list_url:'',
        todos_url:'' ,
        search_url: ''
    };
    this.opts = $ext(defaults, options);
    T.opts = this.opts;
};
T.prototype.list_boards = function () {
    var that = this;
    Xhr.load(this.opts.list_boards_url,{
        onSuccess: function(req){
            $('desktop-holder').clean().append(req.responseText);
            that.update_todos();
        }
    });
};
T.prototype.update_todos = function(){
    var that = this;
    if($('todos-holder') ){
        Xhr.load(that.opts.todos_url,{
            onSuccess: function(res){
                $('todos-holder').clean().append(res.responseText);
                that.update_list_size();
            }
        });

    }
}
T.prototype.view_board = function (event,board_id) {
    if(defined(event) && event != null){
        this.add_bread_crumbs({text:$(event.target).html(),href:event.target.href,onclick:event.target.onclick});
    }

    var that = this;

    Xhr.load(this.opts.view_board_url, {params:{id:board_id},
        onSuccess:function(request){
            $('desktop-holder').clean().insert(request.responseText);
            Draggable.rescan();
            Droppable.rescan();
            that.update_list_size();
        }
    });
};
T.prototype.save_board = function () {
    var that = this;
    $('create-board-form').send({onSuccess:function () {
        that.list_boards();
    }});
}
T.prototype.create_board = function () {
    Lightbox.load(this.opts.create_board_url).show();
}
T.prototype.save_list = function () {
    var that = this;
    $('create-list-form').send({onSuccess:function () {
        that.view_board(null, $('create-list-form').get('data-board-id'));
    }});
}
T.prototype.save_card = function (list_id) {
    var that = this;
    $('create-card-form-' + list_id).send({onSuccess:function () {
        that.update_list(list_id);
    }});
}
T.prototype.update_list = function (list_id) {
    var that = this;
    Xhr.load(this.opts.view_list_url, {params:{listId:list_id},
        onSuccess: function(request){
            var list_div_id = 'list-' + list_id;
            var scope = $(list_div_id);
            scope.clean().insert(request.responseText);
            Draggable.rescan(scope);
            Droppable.rescan(scope);
            that.update_list_size(scope);
        }
    });
}
T.prototype.delete_list = function(list_id){
    var that = this;
    new Xhr(that.opts.delete_list_url,{
            onSuccess:function(){
                var list_div_id = 'list-' + list_id;
                var scope = $(list_div_id);
                scope.remove();
            }
        }
    ).send({listId: list_id});
}
T.prototype.view_card = function (card_id) {
    var that = this;
    Lightbox.load(this.opts.view_card_url, {params:{cardId:card_id},
        onSuccess:function () {
            that.update_comments(card_id);
            new Rte('card-desc-text');
        }});
}
T.prototype.delete_card = function(card_id,list_id){
    var that = this;
    new Xhr(this.opts.delete_card_url, {onSuccess:function () {
        that.update_list(list_id);
    }}).send({'cardId':card_id});
}
T.prototype.toggle_card_finished = function (card_id, list_id) {
    var that = this;
    new Xhr(this.opts.save_card_url, {onSuccess:function () {
        that.update_list(list_id);
    }}).send({'card.id':card_id, 'card.finished':true});
}
T.prototype.update_comments = function(card_id){
    var that = this;
    Xhr.load(that.opts.view_comments_url, {params:{cardId:card_id},
        onSuccess: function(request){
            $('card-comments').clean().insert(request.responseText);
        }
    });
}
T.prototype.save_card_detail = function (card_id) {
    $('update-card-detail-form-' + card_id).send();
}
T.prototype.comment_card = function (card_id) {
    var that = this;
    $('card-comment-form-' + card_id).send({onSuccess:function () {
        that.update_comments(card_id);
    }});
}
T.prototype.create_comment = function (card_id) {
    Xhr.load(this.opts.create_comment_url, {params:{cardId:card_id},
        onSuccess:function (request) {
            $('create-comment').clean().insert(request.responseText);
            new Rte('card-comment-text');
            Lightbox.current.dialog.resize()
        }
    });
}
T.prototype.login = function(){
    $('desktop-holder').load(this.opts.login_url);
}

/*拖放列表*/
T.prototype.list_drag_handler_drop = function(draggable, droppable, event){
    //alert(target);
    //droppable.element.setStyle('background-color','#fe0')
    droppable.element.removeClass('high-light');
    var ghost = draggable.element;
    var from = draggable.element.parent();
    var to = droppable.element;
    from.append(droppable.element.first('.list-box'));
    ghost.erase("style");
    to.append(ghost);
}
/*拖放卡片*/
T.prototype.card_drag_handler_drop = function(draggable, droppable, event){
    var ghost = draggable.element;
    var to = droppable.element;
    ghost.erase("style");
    to.append(ghost);
    new Xhr(T.opts.save_card_url)
        .send({'card.list.id':droppable.element.get('data-list-id'),'card.id':draggable.element.get('data-card-id')});
}
T.prototype.update_list_size = function(scope){
    if(!defined(scope)){
        scope = $('card-lists-table');
    }
    if( $('card-lists-table')){
        var newHeight = $(window).size().y - 152;
        scope.find("#card-lists-container").each(function(it){
            it.setHeight(newHeight);
        });
    }
    if($('todos-container')){
        var newHeight = $(window).size().y - 224;
        $('todos-container').setStyle('height',newHeight+'px')
    }
}

T.prototype.search = function(){
    $('desktop-holder').load(this.opts.search_url);
}

T.prototype.do_search = function(form_id){
    if(form_id==null){
        form_id = 'search-form';
    }
    $(form_id).send({
        onSuccess: function(r) {
            $('desktop-holder').update(r.responseText);
        }
    });
}


//私有方法
T.prototype.add_bread_crumbs = function(action){

    var bread_crumbs = $('actions-bread-crumbs');
    var exists = false;
    bread_crumbs.find('a').each(function(it){
        if(it.get('onclick') == action.onclick){
            exists = true;
        }
    });
    if(!exists){
        bread_crumbs.append($E('a',{html:action.text, href:action.href, onclick: action.onclick}));
    }
}

//水平滚动相关
T.scroll_offset = function(offset, bounds){
    if(T.scroll_runner_lock==false){
        clearInterval(T.scroll_runner);
        return;
    }
    var list_table = $('card-lists-table');
    if(!defined(list_table)|| list_table == null ){
        T.scroll_runner_lock = false;
        clearInterval(T.scroll_runner);
        return;
    }
    var cstr = list_table.getStyle('margin-left');
    var current = cstr.substr(0,cstr.length-2).toInt();
    var newVar = current+offset;
    var desktop = $('desktop-holder');
    var desktop_size = desktop.size();
    var table_size = list_table.size();
    //move right
    if(offset > 0 && newVar > 0){
        newVar = 0;
        T.scroll_runner_lock = false;
        clearInterval(T.scroll_runner);
    }else if(offset < 0 && newVar < (desktop_size.x-table_size.x)){
        newVar = desktop_size.x - table_size.x;
        T.scroll_runner_lock = false;
        clearInterval(T.scroll_runner);
    }

    list_table.setStyle('margin-left',newVar+'px')
    //$('actions-bread-crumbs').append(' '+cstr);
}
T.scroll_runner_lock = false;
T.scroll_runner;
T.prototype.stop_scroll = function(){
    T.scroll_runner_lock = false;
    clearInterval(T.scroll_runner);
}
T.prototype.scroll_desktop_left = function(){
    if(T.scroll_runner_lock == false){
        T.scroll_runner_lock = true;
        T.scroll_runner = setInterval('T.scroll_offset(10)',30);
    }
}
T.prototype.scroll_desktop_right = function(){
    if(T.scroll_runner_lock == false){
        T.scroll_runner_lock = true;
        T.scroll_runner=setInterval('T.scroll_offset(-10)',30);
    }
}
T.prototype.do_some_init = function(){
    var that = this;
    var _resize = function () {
        var wsize = $(window).size();
        $('desktop-wrapper').setStyle('height', wsize.y - 80 + 'px');
        $('desktop-holder').setStyle('height', wsize.y - 80 + 'px');

        t.update_list_size();
    };
    $(window).on({
        resize:_resize,
        mouseleave: that.stop_scroll
    });
    _resize();
    var scroll_handler = function(event){
        //$('actions-bread-crumbs').append(' '+T.lock);
        var list_table = $('card-lists-table');
        if(!defined(list_table)|| list_table == null ){
           that.stop_scroll();
            return;
        }
        var mouse_pos = event.position();
        var desktop = $('desktop-holder');
        var desktop_size = desktop.size();
        var desktop_pos = desktop.position();
        var offset = {x: mouse_pos.x - desktop_pos.x,y:mouse_pos.y-desktop_pos.y};

        if(offset.x <  30){
            that.scroll_desktop_left();
        }else if(  -30<(offset.x - desktop_size.x) ){
            that.scroll_desktop_right();
        }else{
            that.stop_scroll();
        }
    };

    $(document).on({
        mouseover:scroll_handler
    });
}