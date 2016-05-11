import xlrd
rb = xlrd.open_workbook('./test.xls', formatting_info=True)
sheet = rb.sheet_by_index(0)
# for rownum in range(sheet.nrows):
# 	row = sheet.row_values(rownum)
# 	for c_el in row:
# 		print (c_el)
for rownum in range(sheet.nrows):
	if (sheet.cell(rownum, 0).value):
		print(sheet.cell(rownum, 0).value)
		continue
	else:
		col_answ = 1
		col_status = 2
		print(" вопрос: "+ sheet.cell(rownum,col_answ).value + " правильно: " + sheet.cell(rownum,col_status).value)