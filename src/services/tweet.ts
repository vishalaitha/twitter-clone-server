import { prismaClient } from "../clients/db";
import { redisClient } from "../clients/redis";

export interface CreateTweetPayload {
  content: string;
  imageURL?: string;
  userId: string;
}

class TweetService {
  public static async createTweet(data: CreateTweetPayload) {
    const rateLimitFlag = await redisClient.get(
      `RATE_LIMIT:TWEET:${data.userId}`
    );
    try{
        if (rateLimitFlag) {
          // Should implement this later
          throw new Error("Please wait for 5 seconds and reload the page.................................................................................................................................................................................................................................................");
        }
    }
    catch(error){
        console.log("you're exceeding the limit")
    }
    const tweet = await prismaClient.tweet.create({
      data: {
        content: data.content,
        imageURL: data.imageURL,
        author: { connect: { id: data.userId } },
      },
    });
    await redisClient.setex(`RATE_LIMIT:TWEET:${data.userId}`, 10, 4);
    await redisClient.del("ALL_TWEETS");
    return tweet;
  }

  public static async getAllTweets() {
    const cachedTweets = await redisClient.get("ALL_TWEETS");
    if (cachedTweets) return JSON.parse(cachedTweets);

    const tweets = await prismaClient.tweet.findMany({
      orderBy: { createdAt: "desc" },
    });
    await redisClient.set("ALL_TWEETS", JSON.stringify(tweets));
    return tweets;
  }
}

export default TweetService;