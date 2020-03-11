import scipy.stats
import json

filename = 'avandekl.json'

with open(filename) as file:
    json_file = json.load(file)
    keys = list(json_file.keys())
    for i in range(len(keys)):
        for j in range(i+1, len(keys)):
            print(scipy.stats.spearmanr(json_file[keys[i]], json_file[keys[j]]))
