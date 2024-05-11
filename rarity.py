import requests
from bs4 import BeautifulSoup
import re
import mysql.connector


url = 'https://noeve-grafx.com/catalogue-des-cartes-noeve-grafx/'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')
connection = mysql.connector.connect(
    host="192.168.1.155",
    port="3310",
    user="svc-development",
    password="R?9jrdJyNhP8egDF",
    database="cardfolio"
)
cursor = connection.cursor()



if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')

    li_with_select = soup.find('li', {'data-sf-field-name': '_sft_attachment_tag'})
    if li_with_select:

        select_element = li_with_select.find('select')
        if select_element:
            options = select_element.find_all('option')
            for option in options:
                if re.match(r'^Cartes', option.text):
                    result = re.sub(" *[(]\d*[)] *","", option.text).strip()
                    print(result)
                    if not re.search(r'\b\w*tome\w*\b', result):
                        match = re.search(r'Cartes\s*(\w{2})', result)
                        if match:
                            code = "-" + match.group(1).upper()
                    else :
                        code = ""
                    try :
                        query = "INSERT INTO rarities (name, code) VALUES (%s, %s)"
                        cursor.execute(query, (result, code))
                        connection.commit()
                    except mysql.connector.IntegrityError as e:
                        if e.errno == 1062:  # Erreur de clé dupliquée
                            print("Une ligne avec les mêmes données existe déjà dans la base de données.")
                        else:
                            print("Une erreur s'est produite lors de l'insertion dans la base de données :", e)
  
        else:
            print("Aucun élément <select> trouvé dans la balise <li>.")
    else:
        print("Aucune balise <li> avec l'attribut 'data-sf-field-name=\"_sft_serie\"' trouvée sur la page.")
    cursor.close()
    connection.close()
else:
    print("La requête a échoué avec le code :", response.status_code)