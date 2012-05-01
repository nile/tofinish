package models;

import play.db.jpa.Model;
import play.modules.elasticsearch.annotations.ElasticSearchEmbedded;
import play.modules.elasticsearch.annotations.ElasticSearchable;

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
@ElasticSearchable
@Entity
public class MCard extends Model {
    public String name;
    @OneToOne
    @ElasticSearchEmbedded
    public MList list;
    @Temporal(TemporalType.TIMESTAMP)
    public Date createdAt;
    @Temporal(TemporalType.TIMESTAMP)
    public Date due;
    @Lob
    public String description;
    public Date finishedAt;

    public boolean finished;
    //public String color;
    @ElasticSearchEmbedded
    @OneToMany(cascade=CascadeType.PERSIST, fetch=FetchType.EAGER, mappedBy = "card")
    public List<MComment> comments;

    public void deleteCascade() {
        MComment.delete("card = ?",this);
        this.delete();
    }
}
