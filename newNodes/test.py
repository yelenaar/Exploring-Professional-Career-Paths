import sys

fin = open("test.csv","r")
output = fin.read()
output = output.replace('\\\n',' ')
output = output.replace('    ',' ')
output = output.replace('   ',' ')
output = output.replace('  ',' ')

fout = open("output.csv","r+")
fout.write(output)

