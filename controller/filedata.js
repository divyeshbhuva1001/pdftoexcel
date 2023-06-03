const PdfParse = require("pdf-parse");
const datamodel = require("../model/datamodel");
const fs = require('fs')
const ExcelJS = require('exceljs');

module.exports.insertpdf = async (req, res) => {
  try {

    const body = req.file.path
    const buffer = fs.readFileSync(body);
    let data = await PdfParse(buffer)
      .then(function (data) {

        const insertpdfdetile = {
          insertpdf: data.text,
        };

        datamodel.create(insertpdfdetile)
          .then(data => {
            res.status(200).send({
              status: "Success",
              data: data
            });
          })
          .catch(err => {
            res.status(500).send({
              status: "failed",
              message: "Some Error Occurred While Creating The User."
            });
          });
      }).catch(function (error) {
        return res.status(400).json({
          status: "failed",
          message: "Pdf Not Extract Try Again"
        });
      })

  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: "404 Error"
    })
  }
}

module.exports.GetData = async (req, res) => {

    const data = await datamodel.findAll({})

    if (data) {

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');

      let output = data[data.length - 1].dataValues.insertpdf
      const lines = output.split('\n');
      const word1 = 'Profile Applicability: ';
      const word2 = 'Description: ';
      const word3 = 'Rationale: ';
      const word4 = 'Audit: ';
      const word5 = 'Remediation: ';
      const word6 = 'CIS Controls: ';

      const newdata = lines.map((item, index, arr) => {
        if (item.includes(word1)) {
          return {
            'profile_applicability': arr.slice(index + 1, index + 1 + arr.slice(index + 1).indexOf(word2)).map(line => line.replace(' ', '')).join(''),
          }
        } else if (item.includes(word2)) {
          return {
            'Description': arr.slice(index + 1, index + 1 + arr.slice(index + 1).indexOf(word3)).join(''),
          }
        } else if (item.includes(word3)) {
          return {
            'Rationale': arr.slice(index + 1, index + 1 + arr.slice(index + 1).indexOf(word4)).join(''),
          }
        } else if (item.includes(word4)) {
          return {
            'Audit': arr.slice(index + 1, index + 1 + arr.slice(index + 1).indexOf(word5)).join(''),
          }
        } else if (item.includes(word5)) {
          return {
            'Remediation': arr.slice(index + 1, index + 1 + arr.slice(index + 1).indexOf(word6)).filter(line => line.trim() !== '').filter(line => !line.includes('P a g e')).join(''),
          }
        } else if (item.includes(word6)) {
          return {
            'title': arr.slice(index + 1, index + 1 + arr.slice(index + 1).indexOf(word1)).slice(-2).filter(line => line.trim() !== '').join(''),
          }
        }
        return ""
      }).filter(item => !!item)

      let tmp = 0
      let setNewData = []
      let setObj = {}
      newdata.map((item, index) => {
        let getKey = Object.keys(item)[0]
        setObj[getKey] = item[getKey]
        if (tmp == 5) {
          tmp = -1
          setNewData.push(setObj)
          setObj = {}
        }
        tmp++
      })

      worksheet.columns = [
        { header: 'Name', key: 'profile_applicability', width: 60 },
        { header: 'Description', key: 'Description', width: 200 },
        { header: 'Rationale', key: 'Rationale', width: 250 },
        { header: 'Audit', key: 'Audit', width: 250 },
        { header: 'Remediation', key: 'Remediation', width: 250 },
        { header: 'title', key: 'title', width: 100 },
      ];

      setNewData.forEach(item => {
        worksheet.addRow(item);
      });

      const filename = 'example.xlsx';
      workbook.xlsx.writeFile(filename)
        .then(() => {
          console.log(`Excel file "${filename}" generated successfully.`);
        })
        .catch(error => {
          console.error('Error generating Excel file:', error);
        });


      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=example.xlsx'
      );

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });

    } else {
      return res.status(400).send("data Not Found")
    }
}

