class News {
  newsArray = [];
  subscribe(topiName, callback) {
    this.newsArray = [
      ...this.newsArray,
      { topiName, callback, removed: false, runOnce: false },
    ];
    const lastItem = this.newsArray.length - 1;
    return {
      remove: () => {
        this.newsArray[lastItem].removed = true;
      },
    };
  }
  subscribeOnce(topiName, callback) {
    this.newsArray = [
      ...this.newsArray,
      { topiName, callback, removed: false, runOnce: true },
    ];
  }
  publish(topicName, topicDescription) {
    const filterNews = this.newsArray.filter((news) => !news.removed);
    const lastNew = filterNews[filterNews.length - 1];

    lastNew.callback(topicDescription);

    if (lastNew.runOnce) {
      lastNew.removed = true;
    }
  }
  publishAll(topicDescription) {
    this.newsArray
      .filter((news) => !news.removed)
      .forEach(({ callback }) => {
        callback(topicDescription);
      });
  }
}

const news = new News();

const topicSubscription = news.subscribe("topic", function (payload) {
  console.log(`this topic has been triggered with ${payload}`);
});

news.publish("topic", "this information");
// result:
// this topic has been triggered with 'this information

const otherTopicSubscription = news.subscribe("topic", function (payload) {
  console.log(`I have been also summoned with ${payload}`);
});

news.publish("topic", "this information now");
// result:
// this topic has been triggered with 'this information now
// I have been also summoned with this information now

topicSubscription.remove();

news.publish("topic", "another call with this info");
// result:
// I have been also summoned with another call with this info

const anotherTopicSubscription = news.subscribe(
  "AnotherTopic",
  function (payload) {
    console.log(`new topic, new life with ${payload}`);
  }
);

news.publish("AnotherTopic", "so much to publish!");
// result:
// new topic, new life with so much to publish!

news.publishAll("every topic deserves to know!");

// result:
// I have been also summoned with every topic deserves to know!
// new topic, new life with every topic deserves to know!

news.subscribeOnce("topic", function (payload) {
  console.log(`this will only execute once with ${payload}`);
});

news.publish("topic", "more stuff!");
// result:
// I have been also summoned with more stuff!
// this will execute only once with more stuff!

news.publish("topic", "more stuff!");
// result:
// I have been also summoned with more stuff!
