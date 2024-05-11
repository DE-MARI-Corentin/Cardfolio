import os

# Chemin vers le dossier contenant les images
dossier_images = 'nvg_images'

# Liste pour stocker les valeurs uniques
valeurs_uniques = []

# Parcourir les fichiers du dossier
for nom_fichier in os.listdir(dossier_images):
    # Vérifier si le fichier est une image JPG
    if nom_fichier.endswith('.jpg') and nom_fichier.startswith('NG-PR'):
        # Supprimer les chiffres en fin de nom de fichier
        nom_fichier = ''.join([i for i in nom_fichier if not i.isdigit()])
        # Extraire la partie du nom de fichier entre le dernier '-' et '.jpg'
        debut_nom = nom_fichier.rfind('-') + 1
        fin_nom = nom_fichier.rfind('.jpg')
        valeur = nom_fichier[debut_nom:fin_nom]
        # Ajouter la valeur à la liste des valeurs uniques si elle n'est pas déjà présente
        if valeur not in valeurs_uniques:
            valeurs_uniques.append(valeur)

# Afficher la liste des valeurs uniques
print(len(valeurs_uniques))
print("Liste des valeurs uniques:" )
for valeur in valeurs_uniques:
    print(valeur)
