package models;

import play.db.jpa.Model;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: nile
 * Date: 12-4-4
 * Time: 上午12:20
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class MCard extends Model {
    public String name;
    @OneToOne
    public MList list;
    public Date createdAt;
    public Date due;
    @Lob
    public String description;
    public Date finishedAt;
    public boolean finished;

    public List<MComment> comments() {
        List<MComment> comments = MComment.find("card = ?", this).fetch();
        return comments;
    }

    public void deleteCascade() {
        for (MComment comment : comments()) {
            comment.delete();
        }
        this.delete();
    }

    public static List<MCard> todos() {
        List<MCard> todos = MCard.find("finished = ?", false).fetch();
        return todos;
    }
}
