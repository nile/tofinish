package controllers;

import controllers.elasticsearch.ElasticSearchController;
import models.MCard;
import net.sf.oval.guard.Post;
import org.elasticsearch.index.query.QueryBuilders;
import play.modules.elasticsearch.ElasticSearch;
import play.modules.elasticsearch.search.SearchResults;
import play.mvc.Controller;

/**
 * Created with IntelliJ IDEA.
 * User: nile
 * Date: 12-4-26
 * Time: 下午3:22
 * To change this template use File | Settings | File Templates.
 */
@ElasticSearchController.For(MCard.class)
public class Search extends ElasticSearchController {

}
