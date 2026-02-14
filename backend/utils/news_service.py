# Import the requests library to make HTTP API calls
import requests
# Import datetime to generate a fallback publish date if none is provided
from datetime import datetime
# User-Agent is added to avoid request blocking by the server
HEADERS = {"User-Agent": "Mozilla/5.0"}

# Base API endpoint to fetch news posts
BASE_API = "https://sharehubnepal.com/account/api/v1/khula-manch/post"

# Base website URL used to convert relative image URLs into absolute URLs
BASE_URL = "https://sharehubnepal.com"

# Placeholder image used when no image is found in the API response
PLACEHOLDER_IMAGE = "/placeholder.jpg"


def fetch_all_news(max_pages=3):
    """
    Fetches news articles from the ShareHub Nepal API.
    """
    # This list will store all processed news items
    news_list = []
    # Stores the ID of the last fetched post (used for pagination)
    last_post_id = None
    # Page counter to control pagination
    page = 0
    # Loop until we reach the maximum number of pages
    while page < max_pages:
        # Default API parameters
        params = {"MediaType": "News", "Size": 12}
        # If we already fetched posts, use LastPostId for pagination
        if last_post_id:
            params["LastPostId"] = last_post_id
        try:
            # Make GET request to the API with headers and parameters
            res = requests.get(BASE_API, headers=HEADERS, params=params, timeout=10)
            # Raise error if request fails (4xx or 5xx response)
            res.raise_for_status()
        except requests.RequestException as e:
            print(f"Error fetching news: {e}")
            break
        # Convert API response to JSON
        payload = res.json()
        # Extract news items list from response
        items = payload.get("data", [])
        # Stop loop if no news items are returned
        if not items:
            break
        for item in items:
            """
            Attempt to find the image field from the API response.
            Different APIs may use different keys for images.
            """

            # Try multiple possible image fields
            raw_image = item.get("mediaUrl") or item.get("image") or item.get("thumbnail")

            # If image URL is relative (starts with '/'), convert to absolute URL
            if raw_image and raw_image.startswith("/"):
                image_url = f"{BASE_URL}{raw_image}"
            else:
                image_url = raw_image

            # If no image exists, use placeholder image
            if not image_url:
                image_url = PLACEHOLDER_IMAGE

            # Append processed news item to the list
            news_list.append({
                "title": item.get("title", "No title"),
                "source": item.get("sourceName", "ShareHub Nepal"),
                "url": f"https://sharehubnepal.com/news/{item.get('slug')}",
                "image": image_url,
                "publishedAt": item.get("publishedAt") or datetime.now().isoformat()
            })

            # Update last_post_id for pagination
            last_post_id = item.get("id")

        # Move to the next page
        page += 1

    # Return the complete list of fetched news
    return news_list
