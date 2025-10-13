    // Variable pour l'easter Egg d'export
    //easterExport=false;
    function exporter(){
      //Récuperer le tableau
      var tableau=document.getElementById('tableau');

      // Création de l'EXCEL
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'DRANE GE';
      workbook.lastModifiedBy = 'Bot';
      workbook.created = new Date(2023, 4, 13);
      workbook.modified = new Date();
      var worksheet = workbook.addWorksheet('Déroulé');

      // En tête et taille de colonne
      var dobCol = worksheet.getColumn('B');
      dobCol.width = 30;
      var dobCol = worksheet.getColumn('C');
      dobCol.width = 20;
      var dobCol = worksheet.getColumn('D');
      dobCol.width = 30;
      var dobCol = worksheet.getColumn('E');
      dobCol.width = 10;
      var dobCol = worksheet.getColumn('F');
      dobCol.width = 12;
      var dobCol = worksheet.getColumn('G');
      dobCol.width = 12;
      var dobCol = worksheet.getColumn('H');
      dobCol.width = 30;

      worksheet.getCell("D1").value='Votre Session';
      worksheet.getCell("D1").font={
        name: 'Calibri',
        color: { argb: 'FF000000' },
        family: 2,
        size: 20,
        bold:true,
      };
      worksheet.getCell("D1").alignement={
        horizontal:'center',
      }
      worksheet.getCell("B3").value='Type de Carte';
      worksheet.getCell("B3").font={
        name: 'Calibri',
        color: { argb: 'FF000000' },
        family: 2,
        size: 14,
        bold:true,
      };
      worksheet.getCell("B3").alignement={
        horizontal:'center',
      }
      worksheet.getCell("C3").value='Outil';
      worksheet.getCell("C3").font={
        name: 'Calibri',
        color: { argb: 'FF000000' },
        family: 2,
        size: 14,
        bold:true,
      };
      worksheet.getCell("C3").alignement={
        horizontal:'center',
      }
      worksheet.getCell("D3").value='Remarques';
      worksheet.getCell("D3").font={
        name: 'Calibri',
        color: { argb: 'FF000000' },
        family: 2,
        size: 14,
        bold:true,
      };
      worksheet.getCell("D3").alignement={
        horizontal:'center',
      }
      worksheet.getCell("E3").value='Durée';
      worksheet.getCell("E3").font={
        name: 'Calibri',
        color: { argb: 'FF000000' },
        family: 2,
        size: 14,
        bold:true,
      };
      worksheet.getCell("E3").alignement={
        horizontal:'center',
      }
      worksheet.getCell("F3").value='Modalité';
      worksheet.getCell("F3").font={
        name: 'Calibri',
        color: { argb: 'FF000000' },
        family: 2,
        size: 14,
        bold:true,
      };
      worksheet.getCell("F3").alignement={
        horizontal:'center',
      }
      worksheet.getCell("G3").value='Modalité';
      worksheet.getCell("G3").font={
        name: 'Calibri',
        color: { argb: 'FF000000' },
        family: 2,
        size: 14,
        bold:true,
      };
      worksheet.getCell("G3").alignement={
        horizontal:'center',
      }
      worksheet.getCell("H3").value='Matériel';
      worksheet.getCell("H3").font={
        name: 'Calibri',
        color: { argb: 'FF000000' },
        family: 2,
        size: 14,
        bold:true,
      };
      worksheet.getCell("H3").alignement={
        horizontal:'center',
      }

      // Créer un élément canvas pour dessiner le tableau
      for (var k = 1; k < tableau.rows.length-1; k++) {
        // ecriture du type de carte choisi
        worksheet.getCell(String.fromCharCode(66)+(k+3).toString()).value =tableau.rows[k].cells[1].children[1].innerText;
        cellule=String.fromCharCode(66)+(k+1).toString();
        // Réglage couleur de fond de la cellule contenant
        switch (tableau.rows[k].cells[1].children[1].innerText) {
          case 'Acquisition':
            tempsAcquisition+=parseInt(tableau.rows[k].cells[4].children[0].value);
            worksheet.getCell(String.fromCharCode(66)+(k+3).toString()).fill={
              type: 'pattern',
              pattern:'solid',
              fgColor:{argb:'FF16B1A2'},
              bgColor:{argb:'FF16B1A2'}
            };
          break;
          case 'Collaboration':
            tempsCollaboration+=parseInt(tableau.rows[k].cells[4].children[0].value);
            worksheet.getCell(String.fromCharCode(66)+(k+3).toString()).fill={
              type: 'pattern',
              pattern:'solid',
              fgColor:{argb:'FFF39200'},
              bgColor:{argb:'FFF39200'}
            };
          break;
          case 'Discussion':
            tempsDiscussion+=parseInt(tableau.rows[k].cells[4].children[0].value);
            worksheet.getCell(String.fromCharCode(66)+(k+3).toString()).fill={
              type: 'pattern',
              pattern:'solid',
              fgColor:{argb:'FF1D71B8'},
              bgColor:{argb:'FF1D71B8'}
            };
          break;
          case 'Enquête':
            tempsEnquete+=parseInt(tableau.rows[k].cells[4].children[0].value);
            worksheet.getCell(String.fromCharCode(66)+(k+3).toString()).fill={
              type: 'pattern',
              pattern:'solid',
              fgColor:{argb:'FFBE1622'},
              bgColor:{argb:'FFBE1622'}
            };
          break;
          case 'Pratique - Entrainement':
            tempsPratique+=parseInt(tableau.rows[k].cells[4].children[0].value);
            worksheet.getCell(String.fromCharCode(66)+(k+3).toString()).fill={
              type: 'pattern',
              pattern:'solid',
              fgColor:{argb:'FF662483'},
              bgColor:{argb:'FF662483'}
            };
          break;
          case 'Production':
            tempsProduction+=parseInt(tableau.rows[k].cells[4].children[0].value);
            worksheet.getCell(String.fromCharCode(66)+(k+3).toString()).fill={
              type: 'pattern',
              pattern:'solid',
              fgColor:{argb:'FF3AAA35'},
              bgColor:{argb:'FF3AAA35'}
            };
          break;
        }

        for (var i = 2; i < tableau.rows[k].cells.length; i++) {
          if(i==2){
            worksheet.getCell(String.fromCharCode(65+i)+(k+3).toString()).value=tableau.rows[k].cells[i].innerText;
            console.log(tableau.rows[k].cells[i].innerText);

          }else{
            // console.log(tableau.rows[k].cells[i]);
            // console.log(tableau.rows[k].cells[i].innerHTML);
            // console.log(tableau.rows[k].cells[i].value);
            worksheet.getCell(String.fromCharCode(65+i)+(k+3).toString()).value=tableau.rows[k].cells[i].children[0].value;
          }
        }
      }

      //Export de l'excel
      if(tableau.rows.length>2){//si plus que deux lignes alors il y a qqch dans le tableau
        // Exporter le classeur en XLSX
        workbook.xlsx.writeBuffer().then(function(buffer) {
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'export.xlsx';
          link.click();

          // if (easterExport==false){
          //   easterExport=true
          //   var audioDoc = document.getElementById('audioDoc');
          //   audioDoc.play();
          //   surplus.classList.remove('d-none');
          //   setTimeout(function() {
          //       imageDoc.style.opacity = 1;
          //   }, 100);
          //   window.scrollTo(0, surplus.offsetTop);
          //   setTimeout(function() {
          //     imageDoc.style.opacity=0;
          //     setTimeout(function(){
          //       surplus.classList.add('d-none');
          //     },1000);
          //   }, 5000);
          // }
        });
      }else{
        alert('Merci de remplir le tableau!');
      }
    }
