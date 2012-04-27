package models;

import play.db.jpa.Model;
import play.modules.elasticsearch.annotations.ElasticSearchable;

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
@ElasticSearchable
@Entity
public class MBoard extends Model {
    public String name;
    public Date createdAt;
    @OneToOne
    public MUser user;
    public List<MList> lists(){
        return MList.find(" board = ?" ,this).fetch();
    }
    public long countCards(){
       return MCard.count("list.board = ?",this);
    }
}
