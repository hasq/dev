
dim fso
dim curDir
set fso = CreateObject("Scripting.FileSystemObject")
curDir = fso.GetAbsolutePathName(".")

SRC = curDir & "\a.xls"
DST = curDir & "\a.csv"

Dim oExcel
Set oExcel = CreateObject("Excel.Application")
Dim oBook
Set oBook = oExcel.Workbooks.Open(SRC)
oBook.Worksheets("sheet1").Activate
oBook.SaveAs DST, 6
oBook.Close False
oExcel.Quit
