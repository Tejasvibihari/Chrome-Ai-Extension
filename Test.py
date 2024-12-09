# response = requests.get(url)
# print(response.status_code)
#
# # Get Text Without Indentation
# soup = BeautifulSoup(response.text, "lxml" )
# # print(soup)
#
# # Html Tag
# # print(soup.header)
# # print(soup.div)
#
# # Navigable String In Html
# tag = soup.header.p
# # print(tag.string)
#
# tag2 = soup.header
# # print(tag2.attrs)
# a_tag = soup.find_all(name="a")
# for tag in a_tag:
#     # print(tag.getText())
#     print(tag.get("href"))
# # print(a_tag)


from bs4 import BeautifulSoup
import lxml
import requests

url = 'https://www.amazon.com/s?k=gaming+mouse&crid=SWWJU1IKLWI0&sprefix=gaming+mouse%2Caps%2C362&ref=nav_signin'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}
response = requests.get(url, headers=headers)
print(response.status_code)

if response.status_code == 200:
   soup = BeautifulSoup(response.text, "lxml")
   product_title = soup.select("h2 a span")
   count = 1
   for name in product_title:
       print(count)
       print(name.text)
       count = count + 1
   # print(product_title.name)