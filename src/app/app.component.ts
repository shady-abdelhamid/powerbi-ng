import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { models } from 'powerbi-client';
import { PowerBIEmbedModule, PowerBIReportEmbedComponent } from 'powerbi-client-angular';
import { IBasicFilter } from 'powerbi-models';
import { PowerBiService } from './services/powerbi.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PowerBIEmbedModule, HttpClientModule],
  providers: [PowerBiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  @ViewChild(PowerBIReportEmbedComponent) reportObj!: PowerBIReportEmbedComponent;
  
  embedConfig: any;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private powerBiService: PowerBiService) {}

  ngOnInit() {
    this.loadReport();
  }

  private loadReport() {
    this.isLoading = true;
    this.errorMessage = null;

    this.powerBiService.getEmbedToken().subscribe({
      next: (response) => {
        this.embedConfig = {
          type: 'report',
          id: response.reportId,
          embedUrl: response.embedUrl,
          accessToken: response.embedToken,
          tokenType: models.TokenType.Embed,
          settings: {
            background: models.BackgroundType.Default,
            layoutType: models.LayoutType.Master,
            customLayout: {
              displayOption: models.DisplayOption.FitToWidth
            }
          }
        };
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('API Error:', error);
        this.errorMessage = 'Failed to fetch report configuration';
        this.isLoading = false;
      }
    });
  }

  retryLoading() {
    this.loadReport();
  }

  async applyFilter(columnName: string, values: string[]) {
    try {
      const report = await this.reportObj?.getReport();
      if (report) {
        const filter: IBasicFilter = {
          $schema: "http://powerbi.com/product/schema#basic",
          target: {
            table: "YourTableName", // Replace with your actual table name
            column: columnName
          },
          operator: "In",
          values: values,
          filterType: models.FilterType.Basic
        };

        // Apply filter to all pages
        await report.setFilters([filter]);
        console.log('Filter applied successfully');
      }
    } catch (error) {
      console.error('Error applying filter:', error);
    }
  }

  async removeFilters() {
    try {
      const report = await this.reportObj?.getReport();
      if (report) {
        await report.removeFilters();
        console.log('All filters removed');
      }
    } catch (error) {
      console.error('Error removing filters:', error);
    }
  }
}
