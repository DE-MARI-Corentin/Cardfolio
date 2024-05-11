import requests
from bs4 import BeautifulSoup
import urllib
import os
import re
import json


url = 'https://noeve-grafx.com/catalogue-des-cartes-noeve-grafx/'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Fichier JSON de sortie
output_file = 'series.json'

# Initialisation d'un dictionnaire pour stocker les données
data = {}

# Vérifier si la requête a réussi
if response.status_code == 200:
    # Analyser le contenu HTML de la page
    soup = BeautifulSoup(response.text, 'html.parser')

    # Trouver la balise <li> avec l'attribut 'data-sf-field-name="_sft_serie"'
    li_with_select = soup.find('li', {'data-sf-field-name': '_sft_serie'})
    #li_with_select = soup.find('li', {'data-sf-field-name': '_sft_attachment_tag'})
    # Vérifier si la balise <li> existe
    if li_with_select:
        # Obtenir le parent série
        parent_serie = li_with_select.find_parent('div', class_='parent-serie')

        # Vérifier si le parent série existe
        if parent_serie:
            # Ajouter le parent série au dictionnaire de données
            data['parent_serie'] = parent_serie.text.strip()

        # Trouver l'élément <select> à l'intérieur de la balise <li>
        select_element = li_with_select.find('select')

        # Vérifier si l'élément <select> existe
        if select_element:
            # Initialiser une liste pour stocker les options
            options_list = []

            # Obtenir toutes les options de l'élément <select>
            options = select_element.find_all('option')

            # Parcourir les options et les ajouter à la liste
            for option in options:
                options_list.append(re.sub(" *[(]\d*[)] *","", option.text).strip())

            # Ajouter la liste d'options au dictionnaire de données
            data['series'] = options_list

            # Enregistrer les données dans le fichier JSON
            with open(output_file, 'w',encoding='utf-8') as json_file:
                json.dump(data, json_file, ensure_ascii=False, indent=4)
            print(f"Les données ont été enregistrées dans '{output_file}'.")
        else:
            print("Aucun élément <select> trouvé dans la balise <li>.")
    else:
        print("Aucune balise <li> avec l'attribut 'data-sf-field-name=\"_sft_serie\"' trouvée sur la page.")
else:
    print("La requête a échoué avec le code :", response.status_code)