import json

from scrapy_redis.spiders import RedisSpider
from scrapy.utils.project import get_project_settings
from urllib.parse import unquote
from collections import defaultdict
from pymongo import MongoClient

from ..utils.helper import PostgresHelper


class MemesSpider(RedisSpider):


    
    """
    A Spider that scrapes a given meme page from Know Your Meme.
    This consumes the kym_memes_queue:start_urls queue from a local redis server.

    Usage:
        scrapy crawl memes -o memes.json
    """

    name = "memes"
    allowed_domains = ["knowyourmeme.com"]
    redis_key = "kym_memes_queue:start_urls"
    redis_batch_size = 5  # Fetch 5 urls at a time from redis

    # Max idle time(in seconds) before the spider stops checking redis and shuts down
    max_idle_time = 5

    # In-memory list of children to be inserted into the database
    children = []

    # Retreive settings from the project
    settings = get_project_settings()

    # Setup MongoDB connection

    mongo_client = MongoClient(settings.get("MONGO_SETTINGS")["url"])
    mongo_db = settings.get("MONGO_SETTINGS")["db"]
    mongo_collection = settings.get("MONGO_SETTINGS")["collection"]

    def parse(self, response):
        """
        Parse a meme page.
        The parsing is splitted into multiple functions for better readability.
        """
        # Extract the name of the meme
        name = response.css(".info h1::text").get().strip()
        
        first_paragraph = response.xpath("(//section[@class='bodycopy']//p)[1]//text()").getall()

        # Combiner tous les morceaux de texte
        first_paragraph_text = " ".join(first_paragraph).strip()

        print(first_paragraph_text)

        # Extract the description
        description = response.css(".bodycopy p::text").get()

        all_desription=response.xpath(
                "//meta[@property='og:description']/@content"
            ).get()

        # Extract the image URL
        image_url = response.css(".wide img::attr(src)").get()

        # Prepare the result
        meme_data = {
            "name": name,
            "description": first_paragraph_text,
            "image_url": image_url,
            "url": response.url,
        }

        # Insert the data into MongoDB
        self.mongo_client[self.mongo_db][self.mongo_collection].insert_one(meme_data)

        yield meme_data
