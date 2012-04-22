package models;

import play.db.jpa.Model;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import java.util.Date;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * MUser: nile
 * Date: 12-4-4
 * Time: 上午12:20
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class MBoard extends Model {
    public String name;
    public Date createdAt;
    @OneToOne
    public MUser user;
    public List<MList> lists(){
        return MList.find(" board = ?" ,this).fetch();
    }
}
