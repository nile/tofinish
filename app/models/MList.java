package models;

import play.db.jpa.Model;
import play.modules.elasticsearch.annotations.ElasticSearchEmbedded;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
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
public class MList extends Model {
    public String name;
    @OneToOne
    @ElasticSearchEmbedded
    public MBoard board;
    public Date createdAt;

    public List<MCard> cards(){
        return MCard.find("list = ?" ,this).fetch();
    }

    public void deleteCascade() {
        for (MCard card : this.cards()) {
            card.deleteCascade();
        }
        this.delete();
    }
}
