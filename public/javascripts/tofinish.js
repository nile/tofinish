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
        view_comments_url:'',
        create_comment_url:''
    };
    this.opts = $ext(defaults, options);
};
T.prototype.list_boards = function () {
    $('desktop').load(this.opts.list_boards_url);
};
T.prototype.view_board = function (board_id) {
    var that = this;

    Xhr.load(this.opts.view_board_url, {params:{id:board_id},
        onSuccess:function(request){
            $('desktop').clean().insert(request.responseText);
            Draggable.rescan();
            Droppable.rescan();
            that.update_list_size();
        }
    });
};
T.prototype.save_board = function () {
    var that = this;
    $('create-board-form').send({onSuccess:function () {
        Lightbox.hide();
        that.list_boards();
    }});
}
T.prototype.create_board = function () {
    Lightbox.load(this.opts.create_board_url).show();
}
T.prototype.save_list = function () {
    var that = this;
    $('create-list-form').send({onSuccess:function () {
        that.view_board($('create-list-form').get('data-board-id'));
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
T.prototype.view_card = function (card_id) {
    var that = this;
    Lightbox.load(this.opts.view_card_url, {params:{cardId:card_id},
        onSuccess:function () {
            that.update_comments(card_id);
            new Rte('card-desc-text');
        }});
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
    $('desktop').load(this.opts.login_url);
}

/*拖放*/
T.prototype.list_drag_handler_hover = function(draggable, droppable, event){
    //alert(target);
    droppable.element.addClass('high-light');
}
T.prototype.list_drag_handler_leave = function(draggable, droppable, event){
    //alert(target);
    droppable.element.removeClass('high-light');
}
T.prototype.list_drag_handler_drop = function(draggable, droppable, event){
    //alert(target);
    //droppable.element.setStyle('background-color','#fe0')
    droppable.element.removeClass('high-light');
    var ghost = draggable.element;
    var from = draggable.element.parent();
    var to = droppable.element;
    from.append(droppable.element.first('div'));
    ghost.erase("style");
    to.append(ghost);
}
T.prototype.update_list_size = function(scope){
    if(!defined(scope)){
        scope = $('card-lists-table');
    }
    if( $('card-lists-table')){
        var newHeight = $(window).size().y - 212;
        scope.find("#card-lists-container").each(function(it){
            it.setHeight(newHeight);
        });
    }
}

