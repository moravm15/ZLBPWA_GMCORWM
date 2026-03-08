sap.ui.controller("zlbpwa_gmcorwm.ext.controller.ListReportExtension", {

	onAfterRendering: function () {
		this._prepareCustomFilters();
		this._setNumberFormats();
		//this._createEDNLink();
		//this._createGPSControlLink();
		//this._createAttachmentLink();
		//this._setTakenoverDateFormat();
		this._setFiscalPeriodFormatTemplate();
		this._setDateFormatTemplate();
		//this._setColumnsShowIfGrouped();
		//this._setAnalyticalTableAutoResizeColumns();
	},

	onBeforeRebindTableExtension: function (oEvent) {
		//	this._setAnalyticalTableAutoResizeColumns();

		var oSmartTable = oEvent.getSource();
		var oTable = oSmartTable.getTable();

		//Read $filter params to pass selected value in custom filter
		var oBindingParams = oEvent.getParameter("bindingParams");
		oBindingParams.parameters = oBindingParams.parameters || {};

		var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
		var vCategory;
		if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
			var oCustomControl = oSmartFilterBar.getControlByKey("atroLutro");
			oBindingParams.filters.push(new sap.ui.model.Filter("Atro", "EQ", oCustomControl.getState()));
		}
	},

	_prepareCustomFilters: function () {
		let oDecadeFilter = this.byId("decadeFilter");

		let iCurrentYear = (new Date()).getFullYear();

		this.refreshDecadeList(iCurrentYear);

		let sDateRangeString = this.byId("decadeFilter").getSelectedItem().getAdditionalText();
		let aDateRange = sDateRangeString.split(" – ");
		let aDateFrom = aDateRange[0].split(". ");
		let aDateTo = aDateRange[1].split(". ");
		let iDayFrom = parseInt(aDateFrom[0], 10);
		let iMonthFrom = parseInt(aDateFrom[1], 10) - 1;
		let iYearFrom = parseInt(aDateFrom[2], 10);
		let iDayTo = parseInt(aDateTo[0], 10);
		let iMonthTo = parseInt(aDateTo[1], 10) - 1;
		let iYearTo = parseInt(aDateTo[2], 10);
		let oDateFrom = new Date(iYearFrom, iMonthFrom, iDayFrom, 0, 0, 0);
		let oDateTo = new Date(iYearTo, iMonthTo, iDayTo, 23, 59, 59);

		let fSetup = function () {
			let oDateRangeControl = sap.ui.getCore().byId(
				"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReportFilter-filterItemControl_BASIC-Date");
			if (oDateRangeControl) {
				oDateRangeControl.setDateValue(oDateFrom);
				oDateRangeControl.setSecondDateValue(oDateTo);
			} else {
				setTimeout(fSetup, 100);
			}
		}
		setTimeout(fSetup, 100);
	},

	refreshDecadeList: function (iYear) {
		let oDecadeFilter = this.byId("decadeFilter");
		let oDate = new Date();
		let iDec = 1;
		let aDec = [];

		for (let m = 1; m <= 12; m++) {
			for (let d = 1; d <= 3; d++) {
				let oDateStart = new Date(iYear, m - 1, 1 + ((d - 1) * 10));
				let oDateEnd = d === 3 ? new Date(iYear, m, 0) : new Date(iYear, m - 1, 10 + ((d - 1) * 10));
				aDec.push({
					id: iDec++,
					from: oDateStart,
					to: oDateEnd
				});
			}
		}

		aDec.reverse();
		aDec = aDec.filter(function (oDec) {
			return (oDec.from <= oDate);
		});

		oDecadeFilter.removeAllItems();
		for (let i = 0; i < aDec.length; i++) {
			oDecadeFilter.addItem(new sap.ui.core.ListItem({
				key: aDec[i].id,
				text: aDec[i].id,
				additionalText: aDec[i].from.getDate() + ". " + (aDec[i].from.getMonth() + 1) + ". " + aDec[i].from.getFullYear() + " – " + aDec[
					i].to.getDate() + ". " + (aDec[i].to.getMonth() + 1) + ". " + aDec[i].to.getFullYear()
			}));
		}
		oDecadeFilter.setSelectedKey(aDec[0].id);
	},

	onDecadeChange: function (oEvent) {
		let sDateRangeString = oEvent.getSource().getSelectedItem().getAdditionalText();
		let aDateRange = sDateRangeString.split(" – ");
		let aDateFrom = aDateRange[0].split(". ");
		let aDateTo = aDateRange[1].split(". ");
		let iDayFrom = parseInt(aDateFrom[0], 10);
		let iMonthFrom = parseInt(aDateFrom[1], 10) - 1;
		let iYearFrom = parseInt(aDateFrom[2], 10);
		let iDayTo = parseInt(aDateTo[0], 10);
		let iMonthTo = parseInt(aDateTo[1], 10) - 1;
		let iYearTo = parseInt(aDateTo[2], 10);
		let oDateFrom = new Date(iYearFrom, iMonthFrom, iDayFrom, 0, 0, 0);
		let oDateTo = new Date(iYearTo, iMonthTo, iDayTo, 23, 59, 59);

		let oDateRangeControl = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReportFilter-filterItemControl_BASIC-Date");
		oDateRangeControl.setDateValue(oDateFrom);
		oDateRangeControl.setSecondDateValue(oDateTo);
	},

	_setAnalyticalTableAutoResizeColumns: function () {
		let oTable = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--analyticalTable");
		let aColumns = oTable.getColumns();

		let fColumn = function (sIdPart) {
			let aFound = aColumns.filter(function (oColumn) {
				return (oColumn.getId() ===
					"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-" + sIdPart);
			});
			return (aFound.length > 0 ? aFound[0] : {
				setWidth: function () { }
			});
		}

		/*aColumns.forEach(function (_oColumn, iIndex) {
			oTable.autoResizeColumn(iIndex);
		});*/

		// Manual corrections

		// fColumn("Fiscalperiod").setWidth("5rem");
		// fColumn("Decade").setWidth("5rem");
		// fColumn("Date").setWidth("6rem");
		// fColumn("PrestoredO2").setWidth("6rem");
		// fColumn("ZdhO2").setWidth("6rem");
		// fColumn("ZzO2").setWidth("6rem");
		// fColumn("Wi127O2").setWidth("6rem");
		// fColumn("ExhalationO2").setWidth("6rem");
		// fColumn("OpcorO2").setWidth("6rem");
		// fColumn("InvcorO2").setWidth("6rem");
		// fColumn("StoredO2").setWidth("6rem");
		// fColumn("PrestoredO3").setWidth("6rem");
		// fColumn("ZdhO3").setWidth("6rem");
		// fColumn("ZzO3").setWidth("6rem");
		// fColumn("ExhalationO3").setWidth("6rem");
		// fColumn("OpcorO3").setWidth("6rem");
		// fColumn("ZzZdhNak").setWidth("6rem");
		// fColumn("ZzZdhVl").setWidth("6rem");
		// fColumn("Bark").setWidth("6rem");
		// fColumn("Wi171Pil").setWidth("6rem");
		// fColumn("Wi111Fra").setWidth("6rem");
		// fColumn("ScrapVlKura").setWidth("6rem");
		// fColumn("KorPVlZdh").setWidth("6rem");
		// fColumn("InvcorO3").setWidth("6rem");
		// fColumn("ZzZdhNstepka").setWidth("6rem");
		// fColumn("Wi171PilNak").setWidth("6rem");
		// fColumn("Wi171PilMm").setWidth("6rem");
		// fColumn("Wi111FraNak").setWidth("6rem");
		// fColumn("Wi111FraMm").setWidth("6rem");
		// fColumn("ScrapPurKura").setWidth("6rem");
		// fColumn("KorPStepZdh").setWidth("6rem");
		// fColumn("KorIStepNak").setWidth("6rem");
		// fColumn("ZzZdhVstepka").setWidth("6rem");
		// fColumn("ScrapVstepka").setWidth("6rem");
		// fColumn("KnotsBoil57").setWidth("6rem");
		// fColumn("ZzZdhNstepka2").setWidth("6rem");
		// fColumn("ScrapNstepka").setWidth("6rem");
		// fColumn("KnotsNak").setWidth("6rem");
		// fColumn("ZzZdhKura").setWidth("6rem");
		// fColumn("Wi127O3").setWidth("6rem");
		// fColumn("Opcor").setWidth("6rem");
		// fColumn("Invcor").setWidth("6rem");
		// fColumn("StoredO3").setWidth("6rem");
		// fColumn("ZdhKk").setWidth("6rem");
	},

	_setNumberFormats: function () {
		this._setNumberFormat("PrestoredO2");
		this._setNumberFormat("ZdhO2");
		this._setNumberFormat("ZzO2");
		this._setNumberFormat("Wi127O2");
		this._setNumberFormat("ExhalationO2");
		this._setNumberFormat("OpcorO2");
		this._setNumberFormat("InvcorO2");
		this._setNumberFormat("StoredO2");
		this._setNumberFormat("PrestoredO3");
		this._setNumberFormat("ZzO3");
		this._setNumberFormat("ExhalationO3");
		//this._setNumberFormat("OpcorO3");
		this._setNumberFormat("ZzZdhNak");
		this._setNumberFormat("ZzZdhVl");
		this._setNumberFormat("Bark");
		this._setNumberFormat("Wi171Pil");
		this._setNumberFormat("Wi111Fra");
		this._setNumberFormat("ScrapVlKura");
		this._setNumberFormat("KorPVlZdh");
		this._setNumberFormat("InvcorO3");
		this._setNumberFormat("ZzZdhNak");
		this._setNumberFormat("Wi171PilNak");
		this._setNumberFormat("Wi171PilMm");
		this._setNumberFormat("Wi111FraNak");
		this._setNumberFormat("Wi111FraMm");
		this._setNumberFormat("ScrapPurKura");
		this._setNumberFormat("KorPStepZdh");
		//this._setNumberFormat("KorIStepNak");
		this._setNumberFormat("ZzZdhVstepka");
		this._setNumberFormat("ScrapVstepka");
		this._setNumberFormat("KnotsBoil57");
		this._setNumberFormat("ZzZdhNstepka2");
		this._setNumberFormat("ScrapNstepka");
		this._setNumberFormat("KnotsNak");
		this._setNumberFormat("ZzZdhKura");
		this._setNumberFormat("Wi127O3");
		this._setNumberFormat("OpcorO3");
		this._setNumberFormat("Invcor");
		this._setNumberFormat("StoredO3");
		this._setNumberFormat("ZdhKk");
	},

	_setNumberFormat: function (sCol) {
		let oText = new sap.m.Text();
		const oCol = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-" + sCol);
		oCol.setHAlign("End");
		oText.bindText({
			path: sCol,
			formatter: function (sText) {
				if (sText) {
					let dValue = parseFloat(sText);
					const oFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({
						minFractionDigits: 3,
						maxFractionDigits: 3,
						decimals: 3,
						groupingEnabled: true,
						groupingSeparator: ".",
						decimalSeparator: ","
					})
					return oFormatter.format(dValue);
				}
				return sText;
			}
		});
		oText.setTextAlign("End");
		oCol.setTemplate(oText);
	},

	_setDelnoteQtyConsNumberFormat: function () {
		let oText = new sap.m.Text();
		const oCol = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-DelnoteQtyCons");
		oText.bindText({
			path: "DelnoteQtyCons",
			formatter: function (sText) {
				if (sText) {
					return parseFloat(sText).toFixed(2);
				}
				return sText;
			}
		});
		oCol.setTemplate(oText);
	},

	_setDelnoteQtyLbpNumberFormat: function () {
		let oText = new sap.m.Text();
		const oCol = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-DelnoteQtyLbp");
		oText.bindText({
			path: "DelnoteQtyLbp",
			formatter: function (sText) {
				if (sText) {
					return parseFloat(sText).toFixed(2);
				}
				return sText;
			}
		});
		oCol.setTemplate(oText);
	},

	_setDelnoteDrymatterNumberFormat: function () {
		let oText = new sap.m.Text();
		const oCol = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-DelnoteDrymatter");
		oText.bindText({
			path: "DelnoteDrymatter",
			formatter: function (sText) {
				if (sText) {
					return parseFloat(sText).toFixed(2);
				}
				return sText;
			}
		});
		oCol.setTemplate(oText);
	},

	_setDelnoteAtroNumberFormat: function () {
		let oText = new sap.m.Text();
		const oCol = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-DelnoteAtro");
		oText.bindText({
			path: "DelnoteAtro",
			formatter: function (sText) {
				if (sText) {
					return parseFloat(sText).toFixed(3);
				}
				return sText;
			}
		});
		oCol.setTemplate(oText);
	},

	_setDelnoteQtyAtroNumberFormat: function () {
		let oText = new sap.m.Text();
		const oCol = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-DelnoteQtyAtro");
		oText.bindText({
			path: "DelnoteQtyAtro",
			formatter: function (sText) {
				if (sText) {
					return parseFloat(sText).toFixed(2);
				}
				return sText;
			}
		});
		oCol.setTemplate(oText);
	},

	_setDelnoteDedqualNumberFormat: function () {
		let oText = new sap.m.Text();
		const oCol = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-DelnoteDedqual");
		oText.bindText({
			path: "DelnoteDedqual",
			formatter: function (sText) {
				if (sText) {
					return parseFloat(sText).toFixed(0);
				}
				return sText;
			}
		});
		oCol.setTemplate(oText);
	},

	_setDelnoteDedtransNumberFormat: function () {
		let oText = new sap.m.Text();
		const oCol = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-DelnoteDedtrans");
		oText.bindText({
			path: "DelnoteDedtrans",
			formatter: function (sText) {
				if (sText) {
					return parseFloat(sText).toFixed(0);
				}
				return sText;
			}
		});
		oCol.setTemplate(oText);
	},

	_setFmuDescNumberFormat: function () {
		let oText = new sap.m.Text();
		const oCol = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-FmuDesc");
		oText.bindText({
			path: "FmuDesc",
			formatter: function (sText) {
				if (sText) {
					return parseFloat(sText).toFixed(0);
				}
				return sText;
			}
		});
		oCol.setTemplate(oText);
	},

	_setDelnoteTrandistNumberFormat: function () {
		let oText = new sap.m.Text();
		const oCol = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-DelnoteTrandist");
		oText.bindText({
			path: "DelnoteTrandist",
			formatter: function (sText) {
				if (sText) {
					return parseFloat(sText).toFixed(0);
				}
				return sText;
			}
		});
		oCol.setTemplate(oText);
	},

	_createEDNLink: function () {
		let oLink = new sap.m.Link();
		let oColEDN = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-Delnote");
		const oTemplate = oColEDN.getTemplate();
		const oPart = oTemplate.mBindingInfos.text.parts[0];

		oPart.type.oFormatOptions = {};
		oPart.type.oFormatOptions.groupingEnabled = false;
		oLink.mBindingInfos.text = {}
		oLink.mBindingInfos.text.parts = [oPart];
		oLink.attachPress(this.handleEDNLinkPress);
		oColEDN.setTemplate(oLink);
	},

	_createGPSControlLink: function () {
		let oLink = new sap.m.Link();
		let oCol = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-DntransValid");
		const oTemplate = oCol.getTemplate();
		const oPart = oTemplate.mBindingInfos.text.parts[0];

		oPart.type.oFormatOptions = {};
		oPart.type.oFormatOptions.groupingEnabled = false;
		oLink.mBindingInfos.text = {}
		oLink.mBindingInfos.text.parts = [oPart];
		oLink.attachPress(this.handleEDNLinkPress);
		oCol.setTemplate(oLink);
	},

	_createAttachmentLink: function () {
		let oLink = new sap.m.Link();
		let oCol = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-AttachmentsCnt");
		const oTemplate = oCol.getTemplate();
		const oPart = oTemplate.mBindingInfos.text.parts[0];

		oPart.type.oFormatOptions = {};
		oPart.type.oFormatOptions.groupingEnabled = false;
		oLink.mBindingInfos.text = {}
		oLink.mBindingInfos.text.parts = [oPart];
		oLink.attachPress(this.handleEDNLinkPress);
		oCol.setTemplate(oLink);
	},

	handleEDNLinkPress: function (oEvent) {
		const oData = oEvent.getSource().getBindingContext().getObject();
		//alert("Clicked eDN with ID " + oData.ID + ". See console for data.");
		//console.log("Use these data & redirect", oData);
		window.open(window.location.origin + "/sap/bc/ui2/flp" + window.location.search + "#zlbpwa_dn-display&/deliveryNote/" + oData
			.Delnote + "/" + "1000" + "/" + "1");
	},

	_setTakenoverDateFormat: function () {
		let oText = new sap.m.Text();
		let oColDT = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-DelnoteTakenover");
		let oTemplate = oColDT.getTemplate();
		let oPart = oTemplate.mBindingInfos.text.parts[0];

		oPart.type.oFormatOptions.pattern = "dd.M.yy HH:mm";
		oTemplate.mBindingInfos.text.parts = [oPart];
		oText.mBindingInfos = oTemplate.mBindingInfos;
		oColDT.setTemplate(oText);
	},

	_setFiscalPeriodFilterFormat: function () {
		let iCounter = 0;
		let fSetFormat = function (iCounter) {
			let oControl = sap.ui.getCore().byId(
				"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReportFilter-filterItemControl_BASIC-Fiscalperiod"
			);
			if (oControl && iCounter < 30) {
				oControl.setDisplayFormat("MM.yyyy");
				oControl.rerender();
			} else {
				setTimeout(fSetFormat, 100, ++iCounter);
			}
		};
		setTimeout(fSetFormat, 100, iCounter);
	},

	_setFiscalPeriodFormatTemplate: function () {
		let oText = new sap.m.Text();
		const oCol = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-Fiscalperiod");
		oText.bindText({
			parts: [{
				path: "Fiscalperiod",
				type: new sap.ui.model.odata.type.Date({
					UTC: true,
					pattern: "MM.yyyy",
					style: "medium"
				}, {
					isDateOnly: true
				})
			}],
			type: new sap.ui.model.odata.type.Date({
				UTC: true,
				pattern: "MM.yyyy",
				style: "medium"
			}, {
				isDateOnly: true
			})
		});
		oCol.setTemplate(oText);
	},

	_setDateFormatTemplate: function () {
		let oText = new sap.m.Text();
		const oCol = sap.ui.getCore().byId(
			"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-Date");
		oText.bindText({
			parts: [{
				path: "Date",
				type: new sap.ui.model.odata.type.Date({
					UTC: true,
					pattern: "d.M.yyyy",
					style: "medium"
				}, {
					isDateOnly: true
				})
			}],
			type: new sap.ui.model.odata.type.Date({
				UTC: true,
				pattern: "d.M.yyyy",
				style: "medium"
			}, {
				isDateOnly: true
			})
		});
		oCol.setTemplate(oText);
	},

	_setColumnsShowIfGrouped: function () {
		const fSetCol = function (sCol) {
			sap.ui.getCore().byId(
				"zlbpwa_gmcorwm::sap.suite.ui.generic.template.ListReport.view.ListReport::GMCORwmControlSet--listReport-" + sCol
			).setShowIfGrouped(true);
		};

		fSetCol("DnLifnrSupplier");
		fSetCol("DnSupplier");
		fSetCol("DnLifnrSupplierplant");
		fSetCol("DnSupplierplant");
		fSetCol("DelnoteTakenover");
		fSetCol("RwmType");
		fSetCol("Delnote");
		fSetCol("VehicleType");
		fSetCol("TruckOrWagon");
		fSetCol("DelnoteLutro");
		fSetCol("DelnoteQtyCons");
		fSetCol("DelnoteQtyLbp");
		fSetCol("DelnoteDrymatter");
		fSetCol("DelnoteAtro");
		fSetCol("DelnoteQtyAtro");
		fSetCol("DnOthersvcCnt");
		fSetCol("DelnoteDedqual");
		fSetCol("DelnoteDedtrans");
		fSetCol("CertificateFsc");
		fSetCol("CertificatePefc");
		fSetCol("ForestOrLgort");
		fSetCol("FmuDesc");
		fSetCol("EdnClass1");
		fSetCol("EdnClass2");
		fSetCol("EdnClass3");
		fSetCol("DelnoteTrandist");
		fSetCol("DnShipper");
		fSetCol("DnCarrier");
		fSetCol("DntransValid");
		fSetCol("DnDryingstatDesc");
		fSetCol("AttachmentsCnt");
		fSetCol("DelnoteBusstatId");
		fSetCol("DelnoteBusstatDesc");
	}

});