package controllers;

import models.*;
import org.apache.commons.lang.StringUtils;
import play.db.jpa.JPABase;
import play.mvc.Controller;
import play.mvc.With;

import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

@With({LoginUserFilter.class})
public class Application extends Controller {

    public static void index() {
        render();
    }

    public static void login() {
        render();
    }

    public static void logout() {
        session.clear();
        index();
    }

    public static void createBoard() {
        render("Application/create_board.html");
    }

    public static void saveBoard(MBoard board) {
        board.createdAt = new Date();
        board.user = LoginUserFilter.getLoginUser();
        board.save();
    }

    public static void listBoard() {
        if(LoginUserFilter.isUserLogin()){
            final MUser user = LoginUserFilter.getLoginUser();
            final List<MBoard> boards = user.boards();
            render("Application/list_board.html", boards);
        }else{
            render("Application/list_board.html", Collections.emptyList());
        }

    }

    public static void viewBoard(Long id) {
        final MBoard board = MBoard.findById(id);
        final List<MList> lists = board.lists();
        render("Application/view_board.html", board, lists);
    }

    public static void createList(Long boardId) {
        render("Application/create_list.html", boardId);
    }

    public static void viewList(Long listId) {
        MList list = MList.findById(listId);
        render("Application/view_list.html", list);
    }

    public static void saveList(MList list) {
        list.createdAt = new Date();
        list.save();
    }

    public static void deleteList(Long listId) {
        if (listId != null) {
            MList list = MList.findById(listId);
            if (list != null) {
                list.deleteCascade();
            }
        }
    }

    public static void saveCard(MCard card) {
        if (card.id == null || card.id <= 0) {
            card.createdAt = new Date();
        }
        if (card.finished) {
            card.finishedAt = new Date();
        }
        card.save();
    }
    public static void deleteCard(Long cardId){
        if (cardId != null) {
            MCard card = MCard.findById(cardId);
            card.deleteCascade();;
        }
    }
    public static void viewCard(Long cardId) {
        MCard card = MCard.findById(cardId);
        render("Application/view_card.html", card);
    }

    public static void commentCard(MComment comment) {
        comment.createdAt = new Date();
        comment.save();
    }

    public static void viewComments(Long cardId) {
        MCard card = MCard.findById(cardId);
        render("Application/view_comments.html", card);
    }

    public static void createComment(Long cardId) {
        MCard card = MCard.findById(cardId);
        render("Application/create_comment.html", card);
    }

    public static void todos(){
        List<MCard> cards = MCard.todos();
        render("Application/todos.html",cards);
    }
    public static void auth(String email, String password) {
        final MUser user = MUser.find("email = ?", email).first();
        if (user != null) {
            if (StringUtils.equals(user.password, password)) {
                session.put("email", user.email);
                index();
            }
        }
        login();
    }

    public static void register(String email, String password) {
        MUser.register(email, password);
        Notifier.active(email, password);
        login();
    }
}