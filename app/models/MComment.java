package models;

import play.db.jpa.Model;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: nile
 * Date: 12-4-22
 * Time: 上午10:04
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class MComment extends Model {
    @OneToOne
    public MUser user;
    @OneToOne
    public MCard card;
    public Date createdAt;
    public String comment;
}
