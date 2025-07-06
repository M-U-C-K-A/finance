import requests

# URL for Yahoo DSP rate limit API
url = "https://dspapi.admanagerplus.yahoo.com/traffic/ratelimit"

# Fetch the page content
response = requests.get(url)

# Print the response content
print(response.content)

