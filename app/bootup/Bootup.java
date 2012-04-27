package bootup;

import models.MCard;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import play.modules.elasticsearch.ElasticSearch;

import java.util.Iterator;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: nile
 * Date: 12-4-27
 * Time: 上午10:28
 * To change this template use File | Settings | File Templates.
 */
@OnApplicationStart
public class Bootup extends Job{
    public void doJob() {
        System.out.println("系统启动");
        List<MCard> cards = MCard.all().fetch();
        for (Iterator<MCard> iterator = cards.iterator(); iterator.hasNext(); ) {
            MCard card = iterator.next();
            ElasticSearch.index(card);
        }
    }
}
