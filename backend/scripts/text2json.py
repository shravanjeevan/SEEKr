import re
import json

f = open("./Job_category.txt","r")
template = list()
text = f.readlines()
children = list()
name = ''
i = 0
while i < len(text):
    if not re.match("^\t",text[i]) : 
        if i != 0:
            temp = dict()
            temp.update({"name":name})
            temp.update({'children':children})
            template.append(temp)
        name = text[i].strip()
        children = list()
    else:
        text[i] = re.sub(r'\d+','',text[i])
        line = text[i].strip()
        children.append(line)
    if i == len(text)-1:
        temp = dict()
        temp.update({"name":name})
        temp.update({'children':children})
        template.append(temp)
    i = i + 1

with open('./category.json','w') as ouputfile:
    json.dump(template,ouputfile)

print(template)
