from flask import Flask
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)

@app.route("/scrape")
def scrape_data():
    data = {"name":"Tejasvi Kumar",
            "sid":4545
            }
    return data

response = requests.get("https://biharilibrary.in/")

soup = BeautifulSoup(response.text, 'html.parser')
text = soup.get_text(separator="\n", strip=True)
print(soup)
# print(text)