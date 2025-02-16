import {  Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('popupTemplate') popupTemplate!: TemplateRef<any>;

  constructor(private dialog: MatDialog) { }

  title = 'planning';

  options = [
    { value: 'option1', viewValue: 'Option 1' },
    { value: 'option2', viewValue: 'Option 2' },
    { value: 'option3', viewValue: 'Option 3' }
  ];

  openPopup() {
    this.dialog.open(this.popupTemplate, {
      width: '800px',
    });
  }

  xOptions: any = [];
  yOptions: any = [];

  xPoints = []
  yPoints = []

  excelFile: any
  selectedXValue: string = '';
  onXaxisChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedXValue = target.value;
    this.xAxisLabel = this.selectedXValue;
    const xIndex = this.xOptions.findIndex((e: any) => e === this.selectedXValue)
    this.xPoints = this.getValuesForProperty(xIndex)

    for (let index = 0; index < this.xPoints.length; index++) {
      const element = this.xPoints[index];
      if (this.lineChartData[0].series[index]) {
        this.lineChartData[0].series[index].name = element;
      } else {
        console.log(this.lineChartData[0].series[index]);

        this.lineChartData[0].series.push({ name: element });
        console.log(this.lineChartData[0].series[index]);
      }
    }
    console.log(this.lineChartData);
    this.lineChartData = [...this.lineChartData];
  }
  selectedYValue: string = '';
  onYaxisChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedYValue = target.value;
    this.yAxisLabel = this.selectedYValue;
    const yIndex = this.yOptions.findIndex((e: any) => e === this.selectedYValue)
    this.yPoints = this.getValuesForProperty(yIndex)

    for (let index = 0; index < this.yPoints.length; index++) {
      const element = this.yPoints[index];

      if (this.lineChartData[0].series[index]) {
        console.log(this.lineChartData[0].series[index]);

        this.lineChartData[0].series[index].value = element;
        console.log(this.lineChartData[0].series[index]);
      } else {
        console.log('asfas');
        this.lineChartData[0].series.push({ value: element });
      }
    }
    this.lineChartData = [...this.lineChartData];

    console.log(this.lineChartData);

  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      console.error('Cannot use multiple files');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      // Get first sheet name
      const sheetName: string = workbook.SheetNames[0];

      // Get sheet content
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON (array of objects)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      this.xOptions = jsonData[2];
      this.yOptions = jsonData[2];
      this.excelFile = jsonData;

      const jsonKeyValueData = XLSX.utils.sheet_to_json(worksheet);
    };

    reader.readAsBinaryString(target.files[0]);
  }

  getValuesForProperty(propertyIndex: number) {
    const result: any = [];

    for (let i = 6; i < this.excelFile.length; i++) {
      if (this.excelFile[i][propertyIndex] !== undefined) {
        result.push(this.excelFile[i][propertyIndex]);
      }
    }

    return result;
  }

  lineChartData: any = [
    {
      name: '',
      series: [
        // { name: 'Jan', value: 5000 },
        // { name: 'Feb', value: 7200 },
        // { name: 'Mar', value: 6100 },
        // { name: 'Apr', value: 8200 },
        // { name: 'May', value: 6900 },
      ],
    },
  ];

  view: [number, number] = [700, 400]; // Chart size

  // Chart options
  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';
  gradient = false;
  autoScale = true;

  colorScheme = {
    domain: ['#1E88E5', '#D32F2F'],
  };
}
