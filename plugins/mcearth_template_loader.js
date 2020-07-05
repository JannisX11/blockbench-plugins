(function () {

const EntityOptions = {};
let GeneratorAction;

Plugin.register('mcearth_template_loader', {
	title: 'MCEARTH Template Loader',
	icon: 'keyboard_capslock',
	author: 'Ewan Howell',
	description: 'Load template Minecraft Earth models & textures made compatible for use with OptiFine CEM.',
	version: '0.0.2',
	min_version: '3.2.0',
	variant: 'both',
	onload() {

		GeneratorAction = new Action('generate_optifine_template', {
			name: 'MCEARTH Template Loader',
			description: '',
			icon: 'keyboard_capslock',
			click: function() {
				let options = {};
				for (var id in EntityOptions) {
					options[id] = EntityOptions[id].name
				}
				let dialog = new Dialog({
					title: 'Select Entity',
					id: 'generate_optifine_template',
					form: {
						entity: {label: 'MCEarth Entity', type: 'select', options}
					},
					onConfirm(result) {
						if (Format.id !== 'optifine_entity') {
							if (!newProject(Formats.optifine_entity)) return;
						}
						let entity = EntityOptions[result.entity];
						var model = JSON.parse(entity.model);
						Formats.optifine_entity.codec.parse(model, '');
						if (entity.texture_data) {
							new Texture({name: entity.texture_name}).fromDataURL(entity.texture_data).add();
						}
						Undo.history.length = 0;
						Undo.index = 0;
						this.hide();
					}
				});
				dialog.show();
			}
		})
		MenuBar.addAction(GeneratorAction, 'filter');
	},
	onunload() {
		GeneratorAction.delete();
	}
});

EntityOptions.albino_cow = {
	name: 'Albino Cow',
	texture_name: 'albino_cow.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAA7EAAAOxAGVKw4bAAANr2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOS0wMi0yNlQxNTo0OC0wODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDQtMDJUMjI6NTc6MzkrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDQtMDJUMjI6NTc6MzkrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTQxODJmMzItZjMzNy0wODQ3LTg4MzktYTVkMWJkNTliYzBkIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MDBkOTZkMmUtMDY0Mi1jYzQ1LWFkZTAtNzYzZWJjNmE3Yzg5IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NmM2ZTAwOTYtMWNmNy0zOTQzLTkyY2QtOTY3ZTkyMGY4YzkzIj4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjI0NjEzODNjLTMwOTktZGM0Mi1iNzllLTYzMjI5NmMxNTZkMzwvcmRmOmxpPiA8cmRmOmxpPnhtcC5kaWQ6NmM2ZTAwOTYtMWNmNy0zOTQzLTkyY2QtOTY3ZTkyMGY4YzkzPC9yZGY6bGk+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NmM2ZTAwOTYtMWNmNy0zOTQzLTkyY2QtOTY3ZTkyMGY4YzkzIiBzdEV2dDp3aGVuPSIyMDE5LTAyLTI2VDE1OjQ4LTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjMzN2RhMWI2LWIwZGYtMjM0NS05YTExLTNjZmFlNTMxNDFlMSIgc3RFdnQ6d2hlbj0iMjAyMC0wMS0xNlQxNDoyMjozMC0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNzdiYjYwMS0yYjhjLWVhNGQtOGM2MS1iMjk2Y2YxYWQ5ZmIiIHN0RXZ0OndoZW49IjIwMjAtMDEtMTdUMTc6MDE6MTQtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL3BuZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MWExYmEzNTEtYTQ0OC1iZjQ3LTgyMDMtNDNiMzQ5MDhlODFiIiBzdEV2dDp3aGVuPSIyMDIwLTAxLTE3VDE3OjAxOjE0LTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmUxMGRhN2U4LTJhZWEtZjY0MS05MzkwLWVmZWJlZThhMjBjMCIgc3RFdnQ6d2hlbj0iMjAyMC0wMS0yOFQxNDo1Nzo1MC0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjNmYzZTJhYy1mMzEzLTQxNDctYWU4NC1iM2ZlMDNjN2QzYTQiIHN0RXZ0OndoZW49IjIwMjAtMDEtMjhUMTQ6NTc6NTAtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NTQxODJmMzItZjMzNy0wODQ3LTg4MzktYTVkMWJkNTliYzBkIiBzdEV2dDp3aGVuPSIyMDIwLTA0LTAyVDIyOjU3OjM5KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmUxMGRhN2U4LTJhZWEtZjY0MS05MzkwLWVmZWJlZThhMjBjMCIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjllNDBkNjhiLWE4MTgtMTk0MS1iZGYzLTc5ODdmODk0NjE5YSIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjZjNmUwMDk2LTFjZjctMzk0My05MmNkLTk2N2U5MjBmOGM5MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pop4z/gAAAVRSURBVGiBtVnPbxtFFP7W3Tq2SFORpIYIDoAQimik5FJxAFREUThUFVIvzY0DR7hxQfwFXHorFYrUQyskfOLGJSpcCIeqQshFiSIhYqgamq7cpI4dvFnb3R7st3nz9s2sHTeftNrZ3dnZ9715v2bWi+MYGur3q8kDf6wAAOgchMnz//fqAICw1QQAFIrjxvszcwveank5Dh7vAIB3+fOv1O8cC+7c1kkpyGV1IPKyLUGKIKyWl2MAKE1NojQ1Ga+Wl1PvaPdGRXDzqkE+2Kgg2KgA73zkGQfgAfCcCiDCufzwSgge76SOlLDKvVFRmp1H+ca15PqX33519s+0ACLPlcDBTZ/afiGfLekxYumzL5L2h+++j9LsvLWvnzXY0yg0lPA06sUBv5BHJ4wAWIl7cqwfv/0GFy5dSUz0wqUrqN+vOr8fRS3jOp8vOp+fYe1go+IcGxjAAoCeEujg8At54zgOkJIJUdRKSEvynTBCsFFB+ca1hHyWC3hP/t10Rkzp8zwTZIG/S+9FUQv5fNEQXs4q70fZBji0Ok3ZpKgTv/8MAIbZBxsVlD790rTIO7cBMAXUVsp4+cXJ3mDnFlUikrx/dwUAsL27g+nFpUzyREwDVwLvIy0gGZ+5oIA3M7egvmOgr4DEBaYXl7C9exiVH1TX8aC63hPiIExI8PtAj/zEB5+kzbH/jkZeE5xMW44j02syPhuD+tj6umDEAK6ExvVbOHv+Ykr4s+cvonH9FoBD8pKEhDajnEAnjNAJIzR39bQoicnrQnH8SOSBvguQgJovAlD91WbKsp8/VkDnILTOPhdcyyZcKUSUn+UYr597L5V9VPRdwOdEJNEoasHbXDfyWfTG2+p4REwGKFfQ5GTkWDLNhq1mytS5Eo6KHBeeg8g/WruHk7UtnKxt4dHaPXib66m+mjnz6G37hiTP25qPaziq6RN86ZNyBl99aQpP9ppJu82e2SI0IUsJwwr/SvCPen+r9NpQ43B4wV9rAIAzb+qmPSj46nGQNAboCtBM2lZkaVUhv2dLxQBw+uHfHgD4oxK3gWKII1+r0PyaYkLcjeGd8JLxtW8Oi9RaoHp31agMfyh/j9OnegLVG00A8L6++p1zUF7pucjb0pemBE4eSM82gbKOa9XKoa4FRo2shLgbD71GKBTH1e9z8gQtFQ9TqgOOxdAoSpCCDaOEQSq/uOve8OGzTytZm0U4V4OkhHqjSeY/FGjWSHjK5VrpurcTJO2s0la6gg3aHoZUhPffn38MvH+mYWZuwQPSWYD7bFZOJ/ITkyX1G9wapTXJOKDNPtBb0nP3oCww0H7AMKDgpPmsizy1+bXrPQCpZXVW4NOeP3cFSKG4+Y8KSoUEmQn4DGvmrwXI3FGF477MIcmTyWpBlc92Y7em3ufohJFhWVoa1EjKnSyOnLbAkJBkbQrTor/NAohkY7eWkOdK0GQgxN04lQkGzfuyn+ECWZYgFdFq7hvP5YxkVYAaYZcSaEyyAi0DEEHbrKd2tVrNfRTHXzBu2tbaHJK8JigfT8NbB43U3h0APMQ09nYCIyvIPQAZZG0FkMv8AWYBRIjOfLY52VZzP7luR6YStBlxWdUwPzFkeWwrhrgiOHmbgnLtaD9FnmAjDrjJ89nPqigH/YnBd4vIDeJubC2HNcLWNEhk6MzJytluR/sp8sbHj7jmlz8xZFFE47g2VFOy9JUgz7xv4gIaQWpLBQ2KLPK2nxi2QCh3jLrttvFcK4qyFkf+Tysrzg4a+PJ4/uPLhlCasBomJkvAdtUw+6XZ+Z4yxk5Z35OxgO8f+oV8UhzZiEtLeQZtCwoCSv+ioAAAAABJRU5ErkJggg==',
    model: `{
        "texture": "albino_cow.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [18, 4]},
                    {"coordinates": [-2, 11, -6, 4, 6, 1], "textureOffset": [52, 0]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -20, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -14, 8, 8, 6], "textureOffset": [0, 0]},
                    {"coordinates": [-5, 22, -12, 1, 3, 1], "textureOffset": [22, 0]},
                    {"coordinates": [4, 22, -12, 1, 3, 1], "textureOffset": [22, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.amber_chicken = {
	name: 'Amber Chicken',
	texture_name: 'amber_chicken.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFCGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDMtMjZUMjI6NTg6MjhaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTI2VDIyOjU4OjI4WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplMjlmNmE3Ni1hNmUzLTg3NDctODk0ZS04M2ZhNjgxMTNkYWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ZTI5ZjZhNzYtYTZlMy04NzQ3LTg5NGUtODNmYTY4MTEzZGFmIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZTI5ZjZhNzYtYTZlMy04NzQ3LTg5NGUtODNmYTY4MTEzZGFmIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplMjlmNmE3Ni1hNmUzLTg3NDctODk0ZS04M2ZhNjgxMTNkYWYiIHN0RXZ0OndoZW49IjIwMjAtMDMtMjZUMjE6NDE6MTlaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+38lMkQAAA51JREFUaIHtmL9v00AUx7+xHMdJ40atRAdUuqAg0Q6oEqKoFWKBvQNIneBP6EKlDmWCAandCwsSnZBg4A9ggQokJETVIWUILCVhCFJT51zXvxQzOO9ydmPahDbpr48U3fl+OO/de/funRO+74PYWJryFS0Dh5kAgNrGNkRuviwkEKGyPOvLgwPwtqoAAFb+Heq//PTNnjlR1uZn/PFnr/cddxRI4oOte3CYCUXL8DbHdOGYbuwLVlaLXPmV1WLbAqzNz/hi2W1k8SGVk2HrHmy9Bm24H475B1vf+wEAg1droYmV5VkfAB7cyvM2sU6e8HPhvg/Ee0KhWMVYfgCFYhXjh6BQuyQKi5M+AG51cv/oM0FbJLV9sa0/OshWAIBX9yb8h2+/dG07yEDg+oCJsbnP+LZwAwAwNvcehcVJKFoGrBRYP5WTeX20odC7a9dDrju9/vW/hB/uz/7P9LaRdjct/kDKi3WHmajrHuq6B7tRniZk17CQhAq7RScp7BoWklm1WYe6x/IEtXfqCYNDFzqZ1jE8CJJlf30I5L50O9DPNaxQedqQAXALB0qmQW1xuIaF6fW9OcFh0O18ICEmQiI/Xtz1KeAR2nA/WKnGj0sqAWD8Sfci92EixXVEjz8RCpyk/EkOjLELQNQjkT9at8vG0UjWJWIXgFw8PaJCygWx0mEmjw10IvwrTT4JxC4AWZrcPZWTsbsZKOwaFnYqjI8V6wdl7fGE/3HmSk/yfxE5rmOnwkLnf61scGtHy05I5WTYmWTH8w8LWbwCU1BjxSr6hrTQwGRWRTKrYqfCoOUHAARK0NyNpSkfaAZG6h999Knl6RDcNbaPQqe2kOjSo2gZ7vZR5UUXp7667kGcK5JqxIxo+3GExwCHmUiPqKEoLyouJkZ13UN6RG15UySvoEU47vAFULQMbN2DlJPhGlZI4b4hje9317AgNRIg0cJRa+9nfVaqHYsTJFF8fscnS9q6B1asQskkQ8L1DWncG6hPyw905OpirAGacUSElWpdyywloKlANKNThCitRCI2jY37cELPlE47zOTK14UffYYTx3czs5RIODrvRes7pgslkwzFAmoDghxB9B5SgGClGuyyEZS6x/+D8gjaZrubVuB9jfHdRBYFbpXZtTrzqZ7MqvwbItC0etTNKWsEAKcSfo/T2HIwgvcBnSVWnRJ7Gzwr7HsZOu2cL0CvBeg15wvQawF6zfkC9FqAXnPmF+AvWII8MG4QnhcAAAAASUVORK5CYII=',
    model: `{
        "texture": "amber_chicken.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 9, -6, 4, 6, 3], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -8, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 4, -3, 6, 8, 6], "textureOffset": [0, 9]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "right_wing",
                "id": "right_wing",
                "invertAxis": "xy",
                "translate": [-4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "left_wing",
                "id": "left_wing",
                "invertAxis": "xy",
                "translate": [4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "bill",
                "id": "bill",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 11, -8, 4, 2, 2], "textureOffset": [14, 0]}
                ]
            },
            {
                "part": "chin",
                "id": "chin",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 9, -7, 2, 2, 2], "textureOffset": [14, 4]}
                ]
            }
        ]
    }`
}
EntityOptions.ashen_cow = {
	name: 'Ashen Cow',
	texture_name: 'ashen_cow.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAA7EAAAOxAGVKw4bAAATpGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAyLTI2VDE1OjQ4LTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNC0wMlQyMzowNTowOSswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNC0wMlQyMzowNTowOSswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMWUzZWNkYy1jNjMzLWI3NGUtYjIxYS00NjJmNDY4NDIwZTkiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4MWNhYjZiYi01ZGEzLTlkNGYtODEwYi1jOWVmMjAxZWRiOWQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2YzZlMDA5Ni0xY2Y3LTM5NDMtOTJjZC05NjdlOTIwZjhjOTMiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249Ijk2MDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iOTYwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI2NCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjY0Ij4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjI0NjEzODNjLTMwOTktZGM0Mi1iNzllLTYzMjI5NmMxNTZkMzwvcmRmOmxpPiA8cmRmOmxpPnhtcC5kaWQ6NmM2ZTAwOTYtMWNmNy0zOTQzLTkyY2QtOTY3ZTkyMGY4YzkzPC9yZGY6bGk+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NmM2ZTAwOTYtMWNmNy0zOTQzLTkyY2QtOTY3ZTkyMGY4YzkzIiBzdEV2dDp3aGVuPSIyMDE5LTAyLTI2VDE1OjQ4LTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjMzN2RhMWI2LWIwZGYtMjM0NS05YTExLTNjZmFlNTMxNDFlMSIgc3RFdnQ6d2hlbj0iMjAyMC0wMS0xNlQxNDoyMjozMC0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNzdiYjYwMS0yYjhjLWVhNGQtOGM2MS1iMjk2Y2YxYWQ5ZmIiIHN0RXZ0OndoZW49IjIwMjAtMDEtMTdUMTc6MDE6MTQtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL3BuZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MWExYmEzNTEtYTQ0OC1iZjQ3LTgyMDMtNDNiMzQ5MDhlODFiIiBzdEV2dDp3aGVuPSIyMDIwLTAxLTE3VDE3OjAxOjE0LTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmUxMGRhN2U4LTJhZWEtZjY0MS05MzkwLWVmZWJlZThhMjBjMCIgc3RFdnQ6d2hlbj0iMjAyMC0wMS0yOFQxNDo1Nzo1MC0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjNmYzZTJhYy1mMzEzLTQxNDctYWU4NC1iM2ZlMDNjN2QzYTQiIHN0RXZ0OndoZW49IjIwMjAtMDEtMjhUMTQ6NTc6NTAtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZThlOTFlMDktYzQ2Mi0xYTRiLTkwOTQtNTZlN2ZlMzk2MWU5IiBzdEV2dDp3aGVuPSIyMDIwLTAyLTA0VDE2OjA0OjEzLTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvcG5nIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmJjNzgxMDMyLTQ3MjItODQ0Yi1hM2NlLTIzOGY4MDkwNDQzZCIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0wNFQxNjowNDoxMy0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowZmExZjNhYy0zMTgyLWIwNGMtODY5Zi1lMmRjNTU5ZTAzNDIiIHN0RXZ0OndoZW49IjIwMjAtMDItMDdUMTY6NTY6NDctMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjA4NGViNzUtYmQ1My1mMDQ3LWJlOGYtZGQ5NDNiZDEzNzg1IiBzdEV2dDp3aGVuPSIyMDIwLTAyLTA3VDE2OjU2OjQ3LTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50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',
    model: `{
        "texture": "ashen_cow.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [18, 4]},
                    {"coordinates": [-2, 11, -6, 4, 6, 1], "textureOffset": [52, 0]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -20, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -14, 8, 8, 6], "textureOffset": [0, 0]},
                    {"coordinates": [-5, 22, -12, 1, 3, 1], "textureOffset": [22, 0]},
                    {"coordinates": [4, 22, -12, 1, 3, 1], "textureOffset": [22, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.bone_spider = {
	name: 'Bone Spider',
	texture_name: 'bone_spider.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFCGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAxLTEwVDE5OjMwOjQ5WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDEtMTBUMTk6NDY6NDVaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAxLTEwVDE5OjQ2OjQ1WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4M2I3ZWJhZi0wYzRkLTY1NGEtYTc5Yy1mMDMw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',
	model: `{
        "texture": "bone_spider.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -9, 3],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 5, -11, 8, 8, 8], "textureOffset": [32, 4]}
                ]
            },
            {
                "part": "neck",
                "id": "neck",
                "invertAxis": "xy",
                "translate": [0, -9, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 6, -3, 6, 6, 6], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -9, -9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 5, 3, 10, 8, 12], "textureOffset": [0, 12]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -9, -4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 8, 3, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4, -9, -4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-19, 8, 3, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-4, -9, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 8, 0, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4, -9, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-19, 8, 0, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg5",
                "id": "leg5",
                "invertAxis": "xy",
                "translate": [-4, -9, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 8, -3, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg6",
                "id": "leg6",
                "invertAxis": "xy",
                "translate": [4, -9, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-19, 8, -3, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg7",
                "id": "leg7",
                "invertAxis": "xy",
                "translate": [-4, -9, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 8, -6, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            },
            {
                "part": "leg8",
                "id": "leg8",
                "invertAxis": "xy",
                "translate": [4, -9, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-19, 8, -6, 16, 2, 2], "textureOffset": [18, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.bronzed_chicken = {
	name: 'Bronzed Chicken',
	texture_name: 'bronzed_chicken.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGu2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAxLTA5VDExOjAwOjQzLTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMy0yNlQyMjo1OToxOVoiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDMtMjZUMjI6NTk6MTlaIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmUyMzUxMzE5LWEzN2ItNmI0OS05YTE3LWMxOTVkNzMyZDBlNCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjBmY2Y2YWMzLTA2ZGQtMzU0ZS05Yjc1LTMwZGFiYTgzYjdjZiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmRiY2YyOThjLWNhY2YtYTY0YS1hNGNhLTM4MDlhZDExZWI5MiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZGJjZjI5OGMtY2FjZi1hNjRhLWE0Y2EtMzgwOWFkMTFlYjkyIiBzdEV2dDp3aGVuPSIyMDIwLTAxLTA5VDExOjAwOjQzLTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjkxZTYwMTk4LTE3NTYtZGU0NC1hZmYyLWQwNjY5ZmI3YjU5NSIgc3RFdnQ6d2hlbj0iMjAyMC0wMS0xNVQxMDowNzoyMS0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplMjM1MTMxOS1hMzdiLTZiNDktOWExNy1jMTk1ZDczMmQwZTQiIHN0RXZ0OndoZW49IjIwMjAtMDMtMjZUMjI6NTk6MTlaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2K4JDQAABLRJREFUaIHtmEtsE1cUhr8ZP2NPgu2Ay8OpaKiUkEg0EVLfFIRAFRKiQrBAIFasqm4qVSxYVEBZdNFNF626qLpCotn1oUioCqoQUR+oVRFICWkFgZJECTFjO87YHs/Eni4mMx7bMSVuYiuFX7Lm+txzfc//z7n3nmvBMAwsDOzvNoIeFxm9QNDj4tS0hBSJoiRmAZi9cV2gAtcv7DXWhTXmkl4A/rqdLOs/eelG1ZhKnDl91vj4k/P/6rcaEJ1fnOSdkCLRmj9wbeyhTf7a2MNlB3Dm9FnD+Ww03JWGSvLnfxwE4IO+l8vs1y/sNQDe6n7OtjnbViZcPN5vQO1M6Nyxi/Fbw3Tu2FVP/P8ZwvcHeqqUd2ZBEQGR6peTCnmXNdGTLAWAd0+9b3zx1acNWw7uB9ki7R6DoMfFocujfL2vixaPm0OXR/j2QC85fQFZF2wfMAXyxHPCsaExLgpCmTonDaMpa7leiACyLpDRC3y2uxtZF0gWRT56ZStWn9MHqpfJWoaY0NUqY0bVifj9TGZNwpaPrAs8yBb5LSOgX/nTqHz7ABcFYUn7kyIUWVfv0LrgjosBIhSRdYGErrL15/sApHd3Ayb5uBggXoBBbycAB7Xxhga5mhBe2HvQOKiN0+Uqlglw//WttlNcDDAc7WMulSZ+/w4A83dvr6m1XguCYRh8vmc7UEr1D3+6R/+RE0b/vV9tRynoZzjah/B3gPb2LbZdlqcA+OP3L9ekICLAe1dvV3XMpdJ2+2q4h0Fvp22zSFvPVHJm1QNdLdiF0FIiSEE/A4rEMW2cQW+nWRKnIRTe+L8gD0tUghaUxCyDkU6OSeMMKBJg3gfS848aFVtDINbqyKXNDW9Akcil07YNTBGcQtQjyv63zxkdz7/WlPrfiZoCqIsbopO8WlEzVAqxHGyJ9dY1bqXh7j9ywphLpe0rr5Ooqqv4PX67DZBvTQHQ0tYGmDdFX7SNjneOG4cTN1EyKlfDPQDoUisT311a8nQYSQ7j8axfPWZPCDsDnFdei7Tf47eJWzYoJ2/hcOIm30ReQgr62ZMcXTPFkgjgdZnkJFfUJuf3+EE18Bd8oJpLdSGftwdKLpN8KLCZFkViKNbH4cRNhmJ9TLx5FCWjIgUeXxrEubPyjJYJMTevma25pR18vg1mY1GEDbxY6nSMsUQA2H5jkF+6XqVFkWpOrPjkemNeUQhdbxw1NLW0uYXYyIPEWJVjPh/Hp4dpa3Ws2zCENm2mXdtEIBBmYmGUnKTYxHdE9zE1OcKWWC+3Zq8AkJMUe3h2YgaXLwCAVzWzUEupbIvtZOiHcw2pLMWOYC/b2ncCJvlUcgaUhdIHSk8qjrwkMF0EIJtN0uHuoUWR6HCbm+DU5AiyPMXU5AhQIh/bECM/a54uhXwWAK2goqUWb52LRVYjIFoTWuSrjrVF8mqmhTnNDLDSxxlwu7YJMN9+Wf900c6MuyOjAOQypiCWCN6QmQWNrC7dtUpai2wtpOcf0da6nlRypqw0DgTCZLNJstkksjxl9wMwXUQulDa+SOB5tIXFeeZBQ4XHT7viEJx/iz+NqFkJPi14JkCzA2g2ngnQ7ACajWcCNDuAZuOpF+AfG4YajiYM5tQAAAAASUVORK5CYII=',
    model: `{
        "texture": "bronzed_chicken.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 9, -6, 4, 6, 3], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -8, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 4, -3, 6, 8, 6], "textureOffset": [0, 9]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "right_wing",
                "id": "right_wing",
                "invertAxis": "xy",
                "translate": [-4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "left_wing",
                "id": "left_wing",
                "invertAxis": "xy",
                "translate": [4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "bill",
                "id": "bill",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 11, -8, 4, 2, 2], "textureOffset": [14, 0]}
                ]
            },
            {
                "part": "chin",
                "id": "chin",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 9, -7, 2, 2, 2], "textureOffset": [14, 4]}
                ]
            }
        ]
    }`
}
EntityOptions.brule_cow = {
	name: 'Brule Cow',
	texture_name: 'brule_cow.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAPrWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAyLTI2VDE1OjQ4LTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNC0wMlQyMzoxMTo0NSswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNC0wMlQyMzoxMTo0NSswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkMDZiMWRmOS03N2U1LWVjNDktYTA2YS01NTFiY2MzMTlmMmYiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoyN2FmNjIwYS04MzEyLWI0NDktOTgyNy1lZTdjM2FkYzNjMTkiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2YzZlMDA5Ni0xY2Y3LTM5NDMtOTJjZC05NjdlOTIwZjhjOTMiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249Ijk2MDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iOTYwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI2NCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjMyIj4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjM5ZGM4YWY3LWM1YjQtYzM0MC05NTRmLTg3ZmMwOGFkNGYyOTwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2MGI5ZWRlYi02NzVhLWNiNGQtODllNi02ODViZGNhOTlhM2Q8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6N2E4OWQyYTQtMTJjYy0yZTQxLTk4ODAtYmVhZWNmZGE0NDZhPC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjgwOTllMTRjLTNiMWEtOGQ0MS1hZmZlLWQwZWQ1NWM2ZmVjYjwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDphNmYxYjBmOC1jOWMzLTQ4NDYtYmJjNi03MmJjYTVkYmNhNzg8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6ZmFlOGRkYzAtODM2Zi0wZjRiLWI5OWItN2VjNDU1MWQzZjBkPC9yZGY6bGk+IDxyZGY6bGk+eG1wLmRpZDo2YzZlMDA5Ni0xY2Y3LTM5NDMtOTJjZC05NjdlOTIwZjhjOTM8L3JkZjpsaT4gPHJkZjpsaT54bXAuZGlkOmMzMDVhMjM4LWJhYzctMzY0Zi04MThlLWZjMWJhMTQ0MjdlYjwvcmRmOmxpPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjZjNmUwMDk2LTFjZjctMzk0My05MmNkLTk2N2U5MjBmOGM5MyIgc3RFdnQ6d2hlbj0iMjAxOS0wMi0yNlQxNTo0OC0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphNDZmYmEyZS1kNWQ0LTBjNGItODJiMS05NjQ5MDQ2YjZjZDEiIHN0RXZ0OndoZW49IjIwMTktMDktMDNUMTY6NTM6MzItMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL3BuZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODg4NzdmNmItMTAyYi1mYTRiLThlODgtZmEzMTA0OWMwYmVhIiBzdEV2dDp3aGVuPSIyMDE5LTA5LTAzVDE2OjUzOjMyLTA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmFhNDZlZTE5LTVkNmUtNDI0My1hMTc3LTY5OWFhYTUwMDUzYSIgc3RFdnQ6d2hlbj0iMjAxOS0xMS0yMFQxNjo0OToxMi0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplOTFkMDc5OC02MDg3LTI4NDItODllZi00Mzc0MzVjYTU4Y2QiIHN0RXZ0OndoZW49IjIwMTktMTEtMjBUMTY6NDk6MTItMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZDA2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',
    model: `{
        "texture": "brule_cow.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [18, 4]},
                    {"coordinates": [-2, 11, -6, 4, 6, 1], "textureOffset": [52, 0]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -20, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -14, 8, 8, 6], "textureOffset": [0, 0]},
                    {"coordinates": [-5, 22, -12, 1, 3, 1], "textureOffset": [22, 0]},
                    {"coordinates": [4, 22, -12, 1, 3, 1], "textureOffset": [22, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.cluckshroom = {
	name: 'Cluckshroom',
	texture_name: 'cluckshroom.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAScGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAyLTA4VDEzOjQ1OjMxLTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0xMS0wN1QxNToyODoyMloiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMTEtMDdUMTU6Mjg6MjJaIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmVhYjhlMTRhLTBhMTYtNzM0OS1hNThhLWI1YThiMzMwYTNhOSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmEzYzQzMDYwLTU3NWYtZTg0ZS1iY2FiLWU4NTMxZThiNGI3NiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjJlNDcxMzkwLTk4ZjgtMzE0Ni1hOGZlLWUwZTE0MzAxOGE0MCIgdGlmZjpPcmllbnRhdGlvbj0iMSIgdGlmZjpYUmVzb2x1dGlvbj0iOTYwMDAwLzEwMDAwIiB0aWZmOllSZXNvbHV0aW9uPSI5NjAwMDAvMTAwMDAiIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiIGV4aWY6Q29sb3JTcGFjZT0iMSIgZXhpZjpQaXhlbFhEaW1lbnNpb249IjY0IiBleGlmOlBpeGVsWURpbWVuc2lvbj0iMzIiPiA8cGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8cmRmOkJhZz4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6NDg5OWE2ZDYtYjNkYi1iNTQ3LTkzZWEtYTA4OTIxMmMzNmNkPC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjZmOTg4Mzk3LTg3MGMtZjQ0MS1hZDI2LThmNGNhYmY4ZjYzZTwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4OGMxM2IzNy00ZmFkLTY3NDYtYmQ5NS1mOTJmYjcyMmFjMDg8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6OGI5NjgzMTctZTczMC01MzQ2LTgwM2MtMmNmZjdmMDFhMmNjPC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjkwMjAzZTI4LTYyNmQtN2U0ZS1hNWQ2LWU2NGQxMDBhMzI1ZjwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjNzBiODc1ZC1hM2MzLWQ3NDktYTlhZi00ODdjNDZkMmRlN2M8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyZTQ3MTM5MC05OGY4LTMxNDYtYThmZS1lMGUxNDMwMThhNDAiIHN0RXZ0OndoZW49IjIwMTktMDItMDhUMTM6NDU6MzEtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YzIyZDc0YTYtNThiNi00NTQ0LWEyNGItMWZhY2MxOWYwYjAyIiBzdEV2dDp3aGVuPSIyMDE5LTAyLTA4VDE1OjI1OjI3LTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmYwYzRhYzljLWUwNjItNzA0MS1hOWMwLTk4OGI3MDAzODNjZSIgc3RFdnQ6d2hlbj0iMjAxOS0wMy0yNVQxODoxMzoxNi0wNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NWZjOWE4YS0xYWQ0LTQ0NGUtODM3Yi1mNWE0NmYzNjRmZTciIHN0RXZ0OndoZW49IjIwMTktMDMtMjVUMTg6MTM6MTYtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZjQ5OGNjN2MtNzYzZi03ZjQ1LTk5YjEtN2E1ZjQwNGVjMDA5IiBzdEV2dDp3aGVuPSIyMDE5LTA0LTA4VDExOjMxOjU1LTA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvcG5nIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmZiZjRjMmE1LWMxMDgtZmU0MS04MTRkLTI4NDgyODA3Zjk4NyIgc3RFdnQ6d2hlbj0iMjAxOS0wNC0wOFQxMTozMTo1NS0wNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyNDg2MDVlNi01NTdjLTlkNDAtYTIxNS1jMThiYzY3OTY2NmMiIHN0RXZ0OndoZW49IjIwMTktMDQtMDlUMjA6NDI6NTMtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTZlYzdhN2MtMjBjMy0yODRkLTk5NWQtOWNhNWFjODhiNGM1IiBzdEV2dDp3aGVuPSIyMDE5LTA0LTA5VDIwOjQyOjUzLTA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmVhYjhlMTRhLTBhMTYtNzM0OS1hNThhLWI1YThiMzMwYTNhOSIgc3RFdnQ6d2hlbj0iMjAxOS0xMS0wN1QxNToyODoyMloiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRG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',
	model: `{
        "texture": "cluckshroom.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 9, -6, 4, 6, 3], "textureOffset": [0, 0]},
                    {"coordinates": [-3.5, 15, -4.5, 5, 4, 0], "textureOffset": [18, 9]},
                    {"coordinates": [-1, 15, -7, 0, 4, 5], "textureOffset": [18, 4]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -8, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 4, -3, 6, 8, 6], "textureOffset": [0, 9]}
                ],
                "submodels": [
                    {
                        "id": "body_sub_2",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "mirrorTexture": "u",
                        "rotate": [90, 0, 0],
                        "boxes": [
                            {"coordinates": [1, 3, -9, 0, 5, 5], "textureOffset": [28, 3]},
                            {"coordinates": [-1.5, 3, -6.5, 5, 5, 0], "textureOffset": [28, 8]}
                        ]
                    }
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "right_wing",
                "id": "right_wing",
                "invertAxis": "xy",
                "translate": [-4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "left_wing",
                "id": "left_wing",
                "invertAxis": "xy",
                "translate": [4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "bill",
                "id": "bill",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 11, -8, 4, 2, 2], "textureOffset": [14, 0]}
                ]
            },
            {
                "part": "chin",
                "id": "chin",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 9, -7, 2, 2, 2], "textureOffset": [14, 4]}
                ]
            }
        ]
    }`
}
EntityOptions.cookie_cow = {
	name: 'Cookie Cow',
	texture_name: 'cookie_cow.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF4mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDQtMDJUMjM6MTc6MTkrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDQtMDJUMjM6MTc6MTkrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZWEyMzM3NmUtM2I3Zi01ZTQyLTk2YjQtZDZhZmUyOWM5MTk2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOmVhZjMwNzUyLWE4YTctNDU0OS1hMzRhLTEyNTMwMTFmMDI5NyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmVhZjMwNzUyLWE4YTctNDU0OS1hMzRhLTEyNTMwMTFmMDI5NyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZWFmMzA3NTItYThhNy00NTQ5LWEzNGEtMTI1MzAxMWYwMjk3IiBzdEV2dDp3aGVuPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplYTIzMzc2ZS0zYjdmLTVlNDItOTZiNC1kNmFmZTI5YzkxOTYiIHN0RXZ0OndoZW49IjIwMjAtMDQtMDJUMjM6MTc6MTkrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4R7BOqAAALXklEQVRogb2Ze6wdR33HP7M7s7vnPvyI4oCcBj9IBLaxL0KBJpUoNKFCDU0wLg+JmECk/BFQSBpQH9AqqkoJakLbpBQKESpBhETY1MEkkYhCYgdI6xI3iR2uL9Th+pq8uTb32uecPbuzs7v9Y3f27J5z7q3TQn/S0c7O7Dy+3/n9fvOb3xF5njNKdlx1XT42uQq/NY4XtNBRD4C41yVsLzL9+D4A8iwDQDjO4BDi61/8TB4EAW/8ncvEyEl+QzL7rS+PBjVC5FINk6vXIJVXvVsS/NY4rlRAH/xgWTgOX//i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',
    model: `{
        "texture": "cookie_cow.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [18, 4]},
                    {"coordinates": [-2, 11, -6, 4, 6, 1], "textureOffset": [52, 0]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -20, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -14, 8, 8, 6], "textureOffset": [0, 0]},
                    {"coordinates": [-5, 22, -12, 1, 3, 1], "textureOffset": [22, 0]},
                    {"coordinates": [4, 22, -12, 1, 3, 1], "textureOffset": [22, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.dairy_cow = {
	name: 'Dairy Cow',
	texture_name: 'dairy_cow.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAL32lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAyLTI2VDE1OjQ4LTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNC0wMlQyMzoyMToxNyswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNC0wMlQyMzoyMToxNyswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyOThiNzU1Ny1iNjQwLTgzNDUtODFhOC05NjQyYjgwM2FjMzUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDozOWRjOGFmNy1jNWI0LWMzNDAtOTU0Zi04N2ZjMDhhZDRmMjkiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2YzZlMDA5Ni0xY2Y3LTM5NDMtOTJjZC05NjdlOTIwZjhjOTMiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249Ijk2MDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iOTYwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI2NCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjMyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2YzZlMDA5Ni0xY2Y3LTM5NDMtOTJjZC05NjdlOTIwZjhjOTMiIHN0RXZ0OndoZW49IjIwMTktMDItMjZUMTU6NDgtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvcG5nIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjAxZmU1YjUwLTQ5ZDYtZTI0OC1iYzQ2LTE5NTVmY2QyYjU3MiIgc3RFdnQ6d2hlbj0iMjAxOS0wOS0xMVQxMDo0MTo1NS0wNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmZjk4ZjdmZi1kMWQxLWI5NGYtOTE3Ny02YTczMDYxZTFkOTkiIHN0RXZ0OndoZW49IjIwMTktMDktMjBUMTA6MTk6MzgtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Y2UyYTQ5OGEtZmJiMS1jYTQ3LWE5NzEtZjIzMjBkNDgzMjQ3IiBzdEV2dDp3aGVuPSIyMDE5LTA5LTIwVDEwOjE5OjM4LTA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjI5OGI3NTU3LWI2NDAtODM0NS04MWE4LTk2NDJiODAzYWMzNSIgc3RFdnQ6d2hlbj0iMjAyMC0wNC0wMlQyMzoyMToxNyswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpmZjk4ZjdmZi1kMWQxLWI5NGYtOTE3Ny02YTczMDYxZTFkOTkiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmYWU4ZGRjMC04MzZmLTBmNGItYjk5Yi03ZWM0NTUxZDNmMGQiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2YzZlMDA5Ni0xY2Y3LTM5NDMtOTJjZC05NjdlOTIwZjhjOTMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5Ev2NzAAAJfklEQVRogc2YXWwc1RXHf7u298tjZrKrEBFRp1DUKG3jCPADHwIcEWJicOKE4GQDaZwPktKHVBWtxHtfKlDq5qGFAAnhozUxSTBx7MTOlwERhQpa2TykkZCiWKImOLvewbM7O7NffRjP9Y531l5HIPGXrvbOvWfvvefc/z3n3Ovp6enBDY2N9xfserT9KVRNRZZkurqPAdDSskrIypLMSy/9hT2/3SnahodHPC+/tK8wMjLMO+++7XGd5EeA6vPnz7t2NDbeTzAUou3JNaiaKtqDoRB6KiW+i43S339WGGvfy52FJfVL8Hq87Hu5s/DCH3//ozRCdbkON+UHBs85ZGRJpufkKUebbYz9f93H9W+/+T7X+oOgrAFmKl+MoM9Hf/9ZxzeAbpqCIWNjY9/zUn8YlDWArXx/7wAtrc1cuvh5iUwwFBLKg2UI3TQByp77hx98qNDV1U3k1gUEAgEA0um0qOtJ6/+ZfJ4ar5f7HmisSJH+3gHCkQjBWt+8jpp3LoGW1maOHT9Ztl83TWdJpZhUvysrr2oq0Wg7SS0p2go5L3rSFMoDZEy9Uh0AiEbb5yVvw5PSDOHtm1c/Wpb2NgPsHdZTKcKKYg1SlaeQc9qyeKxi9tg7GgqEOHr8GGFloet8sUSCiKIIeVmSAcquT5ZkBgbP3TwD/BcG2b/paQ7v3FUiZCsQj8VY2fQAK5seIBgK8d+Dr3LoD79jqLOTYK2PYO30cbAXOjw84jpxKp0i2r65pL159aM0r34UgP9dHxfKdXW/xwcf9hAKhOaj35zwpnSLasbK1Vy8fJnRb78VnbbVbbS0Nou2oM+Hz+ejacUKHtn7AoCDwrIku/qNYszcTZs1qqbyRMsqNqxfgyzJfPzpJ4SVhdRKtVz4aKhkXbIk09XVPU/VLTh4u/lPf+au229HlmRGRr7k408/cUxmL2Zk5EuxS3du3QFYysfiMRJqApgOmXrSFDS2++aD4x+cIDmZBiCXsfzFwOA5ZEkWZWDwHIGQjxvjsXmP712/7klSuk5K1xkfj7Hllb+jaioNDct5+MGHSv7w8IMP0dCwHFVThfI2bTWt1HHZhkqoCVRVm/cCAdJGknw+j9frJZ/PA5aB7QIQj8eZmIizY2vHvMb2qprK+nVPMj4eY/eubaLDTnJeff0AV699xdVrX/Hq6wfoOXkKWZK5MHSRhJpw0Hb3rm2oqubY6YHBc46jUMyomefZ3tliqBPTEcVWPp/PO0pKn0RPmmztiM5LeZjKA1RNZdPmNkEpgCPvH+ObsVEOvPgi0VVW3t919ix7Ozs58v4xDD1dMph9plVVQ1U1ZFkqkXntjbeEoXtO9KKnrbQ6WMa5mYZJSrNKOahq4qaUB/A0NCwXYfDIez2Ozlh8jKovvuD6lGNcdOut5O69l0j4NiGze9c2hzOTJZnX3nirosmLDVR8PIqZeOCVQwDkClnuunrFdZyrd/6SPc/vQNVUhodH5hUGPXv37gVgaOgCjzzShMfj4T+f/xuAuxvvYf/+/RUNtGJFQ8GtXZZkek70MhGfZHvHFt48/E8yGaPiBW6KbihpCwVCHP+wDwClrg6AbC6LpllG3PT0U0K27/QZADJmGsOYZpEiK55grc+ZCn/00RBNTSu5u/GeihdYCQzDZHvHFlRNZcPGJwA4fersHP8CNVE+o/TXVIljE4/F0A0d0zD5zZ7nHIx84vHHeOcf7wGQyRjs6LAYa/slYYCmppUADA1dKICV/Hiq8ty2aBGvHzwIwHM7dzJ2/XrFFLPjsyIrrhlcVY3P5V+Qy5hMxONEn3Gmt7bT7Os/7VC+OA2eOY+qqaxdt4YTH57iqY1tJXO5XobmSmBuBseP9rG9YwtgOdiZymuTKmYmx+4d20qUsBU//sEJ/H6fw2FGo+1l0+NirF23xrW9xACfffYvCrk5x6sImWxG1BcvXlT2/MfjcVfFbbxy4BC+6jnvbTcFVwZ4qvKO7+d27nQTmxOpdIpotF0kK6FaP2rCMoA2qSLVyWxsawVKqXukuwfyVqQwM3l8NV4UWbmpdcxEca7hCINQGgrT6SyBgPuzQaFQYNkvfuYB+Hp0rADulJQlmb7+QbTkJGriO2TlFvzBIImJOB1bn3VVPhwOE78RF6FywYJbyJjOQJPLZUlqGi2tzRUrHwqEOHjwMHfccacVBWRJdsbxqQntuFwnBa2dm/peuDCCaRolaW04EgGsbG62azUei8rZrHXOjvb0srGttUQ+Ho+L+ob1a0W9prpG1E/09hOORMSjzWyQJZlDh638pLZ2Ov/wnjw1KChx6eLnBP1+YQjbGIqsiG9dN/H5/MiyhKLUuU7W1dVdktKKhRQlP8qCsDBCsfym9jZ279hGYmKCta0tpNIpUey0W9VU1ra2EI/FCEciZeezlQcIh8OEw2FHnxem83Utab3S+Hx+fD6/Q1CRFXI5KwKGgkEUWRHGqhSKrDiYk83m0CadWaQNVVPZ8/x2zOwsKfDU61Il6Dt9xjXd9oL1/mYjk8sTCgYJBYMlRoiEpxeYyefJ5qb/l83mRAlHIoIFsiSTyWaorq5yvQ7npsY42tNbwoT5wO0iJUsy/b0D4q0gm89bt8ai4+UZvx4v1NbWAggGSFPfKV0nMfEdixcvEn+4dm2UJUvqyeTz5E0DJSJ7wEqF7cTH9gczkVATwgnqaR2pzl3ZcpHBDfZ7AICeTtG2ttVhFBvZfJ54LMbWZzbbmWBpKmxDSyaFEWzYb3TF9ZkR3aakbfGZhlBkRaS3Up3M111vs6y+XvRfHh0FLDbkMiaPr1nFbHB7Ceo7fQavt4CXqhJ5W/lieMHa6dlw7drorP3FmM+5XFZfz5tnzojvS1fcb3uVwL5Wg5Ue22UuVJumgT8QFEYwjCx+f7XDL9iIJRKOuhSYnxMsXqSN7Y89Jur3LV3Ksvp6yl+BplFMfccab9zg189Ovw10dXWTddEFa/PzXgDTtMhsGFnxa+g6Hs904mEYGde6G2wWzNyB4utoLuP07jb93fpmIhQIuT6CGobJurYWR6i02ehC/wJAtcdrJSamaWBkMvinLimGkcWYWkhNIDjV5jRCpQywvX8qaYhECCylL125wn1LlwLWESj2CW6KA5w//7Frv89X6tJUTXU9+9gGuOfu5Y5Wj8dDoeD6tiEw43pcVk43dEH7VNIQl6Pie75Ne7B8wuXRUYI//1XJWKFAiM7Ov7Hkpz8hoSbw+62NsmO7YZhl85LZosn/ASiDwfhlfKuRAAAAAElFTkSuQmCC',
    model: `{
        "texture": "dairy_cow.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [18, 4]},
                    {"coordinates": [-2, 11, -6, 4, 6, 1], "textureOffset": [52, 0]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -20, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -14, 8, 8, 6], "textureOffset": [0, 0]},
                    {"coordinates": [-5, 22, -12, 1, 3, 1], "textureOffset": [22, 0]},
                    {"coordinates": [4, 22, -12, 1, 3, 1], "textureOffset": [22, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.muddy_pig_dried = {
	name: 'Dried Muddy Pig',
	texture_name: 'muddy_pig_dried.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAYXGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wOC0xM1QxNDoyODo0OS0wNzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDQtMDJUMjM6Mzk6MDkrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDQtMDJUMjM6Mzk6MDkrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZjJhNDYwNDItZWFiNS01NTQxLTg3OWUtMzc3NGUyYTdjMDEyIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6M2ExYzMyMTMtYjMyMS1hYzQ5LTk4NGQtNzBmMGRhZWFiMWM2IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ODYzZDg5NWItM2U3OS00YTQ5LWJhZjQtNGExYWNlYjFhYmU1Ij4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjNhMWMzMjEzLWIzMjEtYWM0OS05ODRkLTcwZjBkYWVhYjFjNjwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1YzgzYjk2Ni1hNDc2LTBmNGUtYWQ5MS05NDgzYWZjYjVjNmQ8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6N2ExMTAxZGMtZTlkNi03MTRmLWJiM2ItNzM4OGM1NmQ5NjExPC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjdlNjA3NTZjLTI0MWEtNWU0ZC1hMWM4LTBhZTY1YWVjY2Y2MTwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4NGIxNTNjYi04YzZmLTFmNDItYjUyNy01MmQ1ZGE4ZjYxYzM8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6OGI4MzcwMzUtNWZlNS1jYTQ4LTk1NTgtODNlNjZjMmFlNDEwPC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmMzMzI4Yjc3LTFlNzgtOGQ0MC1hNDA5LTE5NDM5NmNmNjk0MDwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDplOWM2NjQ0ZC0zOThlLWQ5NGItOGU1Ni05MGYxMjFhYTUzNDM8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6ZWQ2M2I3MzgtYTQ5Ni01YzRjLWJjMjItMTY4NjNlY2EyNGRiPC9yZGY6bGk+IDxyZGY6bGk+eG1wLmRpZDozN2MxODMzMy0xMWY3LWY0NDQtYmY0ZS0yYmJhOGUyOTNjNGI8L3JkZjpsaT4gPHJkZjpsaT54bXAuZGlkOjg2M2Q4OTViLTNlNzktNGE0OS1iYWY0LTRhMWFjZWIxYWJlNTwvcmRmOmxpPiA8cmRmOmxpPnhtcC5kaWQ6ZjBmNWM4ODgtMDM2ZS1mMTQxLWE4NjktYTAyYWQyMDAxNzdkPC9yZGY6bGk+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODYzZDg5NWItM2U3OS00YTQ5LWJhZjQtNGExYWNlYjFhYmU1IiBzdEV2dDp3aGVuPSIyMDE4LTA4LTEzVDE0OjI4OjQ5LTA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MTBhNmNiMGEtYzVkOS1jNzQzLWIyODMtYWM1MTg0YjY5YjU2IiBzdEV2dDp3aGVuPSIyMDE4LTA4LTIyVDEzOjMyOjE1LTA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjE5ZjE5MGY1LWY2Y2EtNDM0Zi1iMzExLTBkMmQwZGYwMTZkYSIgc3RFdnQ6d2hlbj0iMjAxOC0wOC0yM1QxMzozMjozMy0wNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4YmU0ODY5MC04NDRlLTFmNDItYTQ5Zi1hY2E0M2YxYTg1NzAiIHN0RXZ0OndoZW49IjIwMTgtMDgtMjNUMTM6MzI6MzMtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjU2M2RhYzItYzY5Zi0wZDRhLWE5MGMtZTM1YTEyODVlYWFiIiBzdEV2dDp3aGVuPSIyMDE5LTAyLTExVDExOjIwOjI3LTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvcG5nIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmI3YTE0MmU5LTBlNGItODE0NC04MzRjLTk4MjI4ZjdjMTI5YSIgc3RFdnQ6d2hlbj0iMjAxOS0wMi0xMVQxMToyMDoyNy0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowZDkxZjc0Zi0yY2YzLTc1NGMtYjQyMi02Zjk3ZDJlODUxZTciIHN0RXZ0OndoZW49IjIwMTktMDItMTFUMTI6MDg6MzgtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZGE5ODdiY2EtMjY5ZC1hZjRlLWI4M2EtZDU3YWViZTEwNDcxIiBzdEV2dDp3aGVuPSIyMDE5LTAyLTExVDEyOjA4OjM4LTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjliNmI0YjBhLTI2NzUtYTg0MS04OGJiLTc1MWM3ODEzY2QwZCIgc3RFdnQ6d2hlbj0iMjAxOS0wNC0wOVQxNDo0NzowMS0wNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gaW1hZ2UvcG5nIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGltYWdlL3BuZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplMzllYzAxMi1kYTcwLTBjNDMtYjYxMC1jMTA4MWQwNTY1M2MiIHN0RXZ0OndoZW49IjIwMTktMDQtMDlUMTQ6NDc6MDEtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZTMzMGViZDgtY2Y0My0xNTRlLWE0MTAtNDZkOWU2YTljMDY1IiBzdEV2dDp3aGVuPSIyMDE5LTA0LTA5VDE0OjU0OjM1LTA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmQ2OGQ1MzM4LWUyNmMtODc0MS04YTZjLWI5NmNiZDJlYTdjOCIgc3RFdnQ6d2hlbj0iMjAxOS0wNC0wOVQxNDo1NDozNS0wNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmMmE0NjA0Mi1lYWI1LTU1NDEtODc5ZS0zNzc0ZTJhN2MwMTIiIHN0RXZ0OndoZW49IjIwMjAtMDQtMDJUMjM6Mzk6MDkrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZTMzMGViZDgtY2Y0My0xNTRlLWE0MTAtNDZkOWU2YTljMDY1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmUzOWVjMDEyLWRhNzAtMGM0My1iNjEwLWMxMDgxZDA1NjUzYyIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjg2M2Q4OTViLTNlNzktNGE0OS1iYWY0LTRhMWFjZWIxYWJlNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnAE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',
    model: `{
        "texture": "muddy_pig_dried.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -13, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 7, -5, 10, 16, 8], "textureOffset": [28, 8]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -12, 6],
                "boxes": [
                    {"coordinates": [-4, 8, -14, 8, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-2, 9, -15, 4, 3, 1], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.dyed_cat = {
	name: 'Dyed Cat',
	texture_name: 'dyed_cat.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMS42/U4J6AAAAh5JREFUaEPtlTFOw0AQRXMMjsEl0lBxANKBRIVEwQ1oKWgQFJSI81EjZDTW/9bP92ziOFkSnHzpKdnd+bMz4xhmmZ5uPxtnPr/srRE+SOqlX0FYUe7Ddh1poXqxrxE+SOqlX0FYUe7Ddh1poSU2LSLzKwjryX0Ownar7KIMhA+SexeLmyUQ1pP7HITtVtlFGQgfJPU9P3wczgCypOuIBoLsDGl74jm9Bz2Apvlp5mcX7ff4jLXH8N31/b8GbYxXNFF6mhkR//KYD2AfA0Eb48VGhg4hYuMnS5+f6XpXxMCz/QBtjBcbGTsAJ/Nsy9XVdTuE+OR37qON7cXLsOxU2i+J8UEUytdF/+BxgDxXj8OmS+Da7cULsexU2i+J8fGL4q8iCvUBxB7PV/36GFMC147XkKegMbAVFTFaYDQXXh9A7OmQAr2TIO3+xcJZLLZ7YuHaWKDNax6iTStIu3954djuiYXzyWdPP4hXgOerXgGkrStvStdZ8UprEHkD2fsfxH7g8Q7S1hObLZEVryBNJz7VoX7G0ffvB+DeaMo9hGfqcZC2nrJLlbfX97ZIfvI710jTSb2MX4d6HKStp+xShc2WQJpO7s8aVjzeQdp6yi7dBKTp5OdZ04rHO0hbT9mlCsIGS71ZwxnqcZC2nrJLFYRNV1nTCsKmL///S3A8fWXNBzierrTZu/P7peYVhE9P319NU+IoBnDSSScdsWazX7HGIggFAfNpAAAAAElFTkSuQmCC',
	model: `{
        "texture": "dyed_cat.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "back_left_leg",
                "id": "back_left_leg",
                "invertAxis": "xy",
                "translate": [1.1, -6, -5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.1, 0, 6, 2, 6, 2], "textureOffset": [8, 13]}
                ]
            },
            {
                "part": "back_right_leg",
                "id": "back_right_leg",
                "invertAxis": "xy",
                "translate": [-1.1, -6, -5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.1, 0, 6, 2, 6, 2], "textureOffset": [8, 13]}
                ]
            },
            {
                "part": "front_left_leg",
                "id": "front_left_leg",
                "invertAxis": "xy",
                "translate": [1.2, -10.2, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.2, 0.2, -5, 2, 10, 2], "textureOffset": [40, 0]}
                ]
            },
            {
                "part": "front_right_leg",
                "id": "front_right_leg",
                "invertAxis": "xy",
                "translate": [-1.2, -10.2, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.2, 0.2, -5, 2, 10, 2], "textureOffset": [40, 0]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -9, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-0.5, 1, 8, 1, 8, 1], "textureOffset": [0, 15]}
                ]
            },
            {
                "part": "tail2",
                "id": "tail2",
                "invertAxis": "xy",
                "translate": [0, -1, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-0.5, -7, 8, 1, 8, 1], "textureOffset": [4, 15]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -9, 9],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.5, 7, -12, 5, 4, 5], "textureOffset": [0, 0]},
                    {"coordinates": [-1.5, 7.02, -13, 3, 2, 2], "textureOffset": [0, 24]},
                    {"coordinates": [-2, 11, -9, 1, 1, 2], "textureOffset": [0, 10]},
                    {"coordinates": [1, 11, -9, 1, 1, 2], "textureOffset": [6, 10]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -12, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, -7, -2, 4, 16, 6], "textureOffset": [20, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.furnace_golem = {
	name: 'Furnace Golem',
	texture_name: 'furnace_golem.png',
	texture_data: 'data:image/png;base64,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',
    model: `{
        "texture": "furnace_golem.png",
        "textureSize": [128, 128],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -31, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-9, 21, -6, 18, 12, 11], "textureOffset": [0, 40]},
                    {"coordinates": [-4.5, 16, -3, 9, 5, 6], "textureOffset": [0, 70], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -31, 2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 33, -7.5, 8, 10, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-1, 32, -9.5, 2, 4, 2], "textureOffset": [24, 0]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [0, -31, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-13, 3.5, -3, 4, 30, 6], "textureOffset": [60, 21]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [0, -31, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [9, 3.5, -3, 4, 30, 6], "textureOffset": [60, 58]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [5, -13, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-7.5, 0, -3, 6, 16, 5], "textureOffset": [37, 0]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [-5, -13, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1.5, 0, -3, 6, 16, 5], "textureOffset": [60, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.glow_squid = {
	name: 'Glow Squid',
	texture_name: 'glow_squid.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNv1OCegAAAOiSURBVGhD5ZetbhVRFIVrSVA8AgoFCRKHq8M0fQIECHgBBDUYAppUViAqME1wCIIAU0FwCEKCxjRBkgz5JlmTNevuOXOn3FtzxZeZ2Wed/bPm3Gm613XdIq4dHnbOjSdPB3LtMmS9dXnbnXdOrk9RBluoUR+8wofy+INPpyNuPj8a7cl663KlBvhADOD4mhuwf3bcHfw47n7//bNyZU36rDeHaiR33hz3pD4pgy1ITrM+tIrBvfdngxFqhmcGfXHxYYDhBc+bNoB8WzeAAndPTnoYHIjJgOsHB30zHHUNyvX+t5fd7S/P+qsMQYM2682hgRPqQ+qTMthCyRlSwyesgRugIw8ML3hm7X8MoB+uQs9bNYC3XQ0POgVuQL59N2AbJ0CkPimDLRgepk4Aw1cG6AT48JihE4B+nYYTHzbZygloGTD1DeBZb/rRxbvhzSsG6NFmvTm0b4rUJ2WwBUlbJhCTAWqCe06B3jYD+3UTfwaznu5Tn5TBFirgaGgfHrwhYFDWMUOkPuvNob3azynU/Tr5ymALJfbCjtYvS9abo+oBMGKdfOVHJJOto0nm9vhpqbTgejGn00dYzzlwMnqjNKQE/jGDLMiaPnpJa09qp0xQjjl96uhJPwOec+BkMIDEoI+ZEt569bqPVwX945f7pKuadP1R93HQOcSojR7NVG7FgMH5R8hfTA6cDB81hmSDN6eiacCUVugNqMnWHq0pv/QgPffSqx9iaB//+joamGfgnngOnIwM4B635TiQxBv0xqbIJrWn2pda6Ym5nj4qvQYW+neY+40YkAW57u3v92hd2taeHAj05jjq0kpf9QKZ2wdOAyAHTlYM0LMX9Aa5/9z97PHGHBmkPcqfBsCmDJgiB06a3wA1oQaBt0asZYAMYl8rvyCnBpLe71175QZojSvQ7MPv5z2uBe1neExCW+XHGN/nA6lO1Q/P4PocaCkrBtB0FlVBkY0lMmjKAKEjLg1X12cvsHUD5gpyJZZv0dG671F+rzFngGuJoyWmfiAHWsqKASqqAXlWMTXojTn67XMvAwT5vYbyKmfeZz+K8ywDiOVASxkZkA1mMW/C19MAjq7v4+o1eJOep6ohrdcCcisf2hxoKb0BWdTxYtIBb1hNyQD99n2v71Fcuar8lZ5aUOlzoKUMBnjhikrnzTlVo75HKOY6x9cTaXKgpYwMAE+exRytTek9Xq1XzxVz+hxoKWVwlyiDu0QZ3CXK4O7Q7f0DB0AbQ++abPMAAAAASUVORK5CYII=',
	model: `{
        "texture": "glow_squid.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, -8, -6, 12, 16, 12], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "tentacle1",
                "id": "tentacle1",
                "invertAxis": "xy",
                "translate": [-5, 7, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, -25, -1, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            },
            {
                "part": "tentacle2",
                "id": "tentacle2",
                "invertAxis": "xy",
                "translate": [-3.5, 7, 3.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2.5, -25, -4.5, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            },
            {
                "part": "tentacle3",
                "id": "tentacle3",
                "invertAxis": "xy",
                "translate": [0, 7, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, -25, -6, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            },
            {
                "part": "tentacle4",
                "id": "tentacle4",
                "invertAxis": "xy",
                "translate": [3.5, 7, 3.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4.5, -25, -4.5, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            },
            {
                "part": "tentacle5",
                "id": "tentacle5",
                "invertAxis": "xy",
                "translate": [-10, 7, 5],
                "rotate": [0, -90, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, -25, -11, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            },
            {
                "part": "tentacle6",
                "id": "tentacle6",
                "invertAxis": "xy",
                "translate": [3.5, 7, -3.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4.5, -25, 2.5, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            },
            {
                "part": "tentacle7",
                "id": "tentacle7",
                "invertAxis": "xy",
                "translate": [0, 7, -1.65],
                "rotate": [0, -180, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, -25, -2.7, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            },
            {
                "part": "tentacle8",
                "id": "tentacle8",
                "invertAxis": "xy",
                "translate": [-3.5, 7, -3.5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2.5, -25, 2.5, 2, 18, 2], "textureOffset": [48, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.gold_crested_chicken = {
    name: 'Gold Crested Chicken',
    texture_name: 'gold_crested_chicken.png',
    texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF02lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDMtMjZUMjI6NTk6MzdaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTI2VDIyOjU5OjM3WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkYTVjN2U3Yy0zZjBmLWU4NDgtYTcxZS04ZDNi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',
    model: `{
        "texture": "gold_crested_chicken.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 9, -6, 4, 6, 3], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -8, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 4, -3, 6, 8, 6], "textureOffset": [0, 9]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "right_wing",
                "id": "right_wing",
                "invertAxis": "xy",
                "translate": [-4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "left_wing",
                "id": "left_wing",
                "invertAxis": "xy",
                "translate": [4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "bill",
                "id": "bill",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 11, -8, 4, 2, 2], "textureOffset": [14, 0]}
                ]
            },
            {
                "part": "chin",
                "id": "chin",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 9, -7, 2, 2, 2], "textureOffset": [14, 4]}
                ]
            }
        ]
    }`
}
EntityOptions.horned_sheep = {
    name: 'Horned Sheep',
    texture_name: 'horned_sheep.png',
    texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFCGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTAxVDIyOjIyOjA1WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDFUMjI6MzQ6MzVaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTAxVDIyOjM0OjM1WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphN2Q5NzUxZS00YmQ3LTczNDItOWVmNS1iZGZl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',
    model: `{
        "texture": "horned_sheep.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 13, -5, 8, 16, 6], "textureOffset": [22, 10]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -18, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 16, -14, 6, 6, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-7, 16, -15.5, 4, 3, 3], "textureOffset": [20, 0]},
                    {"coordinates": [3, 16, -15.5, 4, 3, 3], "textureOffset": [20, 0]}
                ],
                "submodels": [
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [0, 18, -8],
                        "rotate": [0, 0, -90],
                        "boxes": [
                            {"coordinates": [-5, -7, -4.5, 7, 4, 6], "textureOffset": [28, 0]},
                            {"coordinates": [-5, 3, -4.5, 7, 4, 6], "textureOffset": [28, 0]}
                        ]
                    }
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [-3, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [3, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [-3, -12, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [3, -12, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.jolly_llama = {
    name: 'Jolly Llama',
    texture_name: 'jolly_llama.png',
    texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAHPGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTExLTA3VDE4OjEzOjM0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDFUMjI6Mzk6MzFaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTAxVDIyOjM5OjMxWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplMTJjZTAwMi03OTMyLWFkNDYtYmFiZS1hMDYyODMwZjdhNzkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MmRiN2FkNzQtZmUzOS04ODRhLWFlYzAtZjJkMWRiZmVkYTdhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MmRiN2FkNzQtZmUzOS04ODRhLWFlYzAtZjJkMWRiZmVkYTdhIj4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjJkOGE4ZmM5LTY5ODktNTY0MC1iZTcyLWZjNTdjNTA1N2M0ODwvcmRmOmxpPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjJkYjdhZDc0LWZlMzktODg0YS1hZWMwLWYyZDFkYmZlZGE3YSIgc3RFdnQ6d2hlbj0iMjAxOS0xMS0wN1QxODoxMzozNFoiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODgwYjk2YmItYTk4OS1iYzQ5LTljZGEtZTUwZGYxODAzMzY1IiBzdEV2dDp3aGVuPSIyMDE5LTExLTA3VDE4OjE5OjE2WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplMTJjZTAwMi03OTMyLWFkNDYtYmFiZS1hMDYyODMwZjdhNzkiIHN0RXZ0OndoZW49IjIwMjAtMDItMDFUMjI6Mzk6MzFaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93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',
    model: `{
        "texture": "jolly_llama.png",
        "textureSize": [128, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -17, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 27, -16, 4, 4, 9], "textureOffset": [0, 0]},
                    {"coordinates": [-4, 15, -12, 8, 18, 6], "textureOffset": [0, 14]},
                    {"coordinates": [-2.5, 26.1, -15, 5, 5, 2], "textureOffset": [35, 57]},
                    {"coordinates": [-4.5, 21.1, -12.999, 9, 5, 7], "textureOffset": [57, 52]},
                    {"coordinates": [-4.5, 25.1, -12.5, 9, 7, 7], "textureOffset": [0, 50]},
                    {"coordinates": [-4, 33, -10, 3, 3, 2], "textureOffset": [27, 0]},
                    {"coordinates": [1, 33, -10, 3, 3, 2], "textureOffset": [17, 0]},
                    {"coordinates": [-11, 31, -8, 7, 16, 0], "textureOffset": [73, 16]},
                    {"coordinates": [4, 31, -8, 7, 16, 0], "textureOffset": [73, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [29, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3.5, -14, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5.5, 0, 4, 4, 14, 4], "textureOffset": [29, 29]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3.5, -14, -6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1.5, 0, 4, 4, 14, 4], "textureOffset": [29, 29]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3.5, -14, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5.5, 0, -7, 4, 14, 4], "textureOffset": [29, 29]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3.5, -14, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1.5, 0, -7, 4, 14, 4], "textureOffset": [29, 29]}
                ]
            }
        ]
    }`
}
EntityOptions.jumbo_rabbit = {
    name: 'Jumbo Rabbit',
    texture_name: 'jumbo_rabbit.png',
    texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHiGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTExLTA4VDE4OjExOjM0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDFUMjM6MjI6NDZaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTAxVDIzOjIyOjQ2WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0MDE1MTNiMi1mYjQyLWU0NDAtYWZiZC1jMTkwNGZmYzhlYWMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkYzA4MzZkMS0yODllLWMxNDctYjk2Yi1hZTJmMDcyN2Q0NWYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1MWUxYjI1Ni01YmJhLTA1NDEtYTVmOC1hMDEwOTdlZjc5MzMiPiA8cGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8cmRmOkJhZz4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6ZGMwODM2ZDEtMjg5ZS1jMTQ3LWI5NmItYWUyZjA3MjdkNDVmPC9yZGY6bGk+IDxyZGY6bGk+eG1wLmRpZDpkYTkyNTYzNS03MTc0LWJlNDEtYTQwNC1kNTQ5NzhhMDVlZDI8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1MWUxYjI1Ni01YmJhLTA1NDEtYTVmOC1hMDEwOTdlZjc5MzMiIHN0RXZ0OndoZW49IjIwMTktMTEtMDhUMTg6MTE6MzRaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjI1MDcyZjM2LWE0YzItZTA0Zi04YTQxLTdhYTljOWM0YTk4MyIgc3RFdnQ6d2hlbj0iMjAxOS0xMS0wOFQxODoyMToyMloiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NDAxNTEzYjItZmI0Mi1lNDQwLWFmYmQtYzE5MDRmZmM4ZWFjIiBzdEV2dDp3aGVu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',
    model: `{
        "texture": "jumbo_rabbit.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "left_foot",
                "id": "left_foot",
                "invertAxis": "xy",
                "translate": [3, -8.5, -5.7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2.5, 2.5, 2, 3, 2, 9], "textureOffset": [40, 3]}
                ]
            },
            {
                "part": "right_foot",
                "id": "right_foot",
                "invertAxis": "xy",
                "translate": [-3, -8.5, -5.7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5.5, 2.5, 2, 3, 2, 9], "textureOffset": [40, 3]}
                ]
            },
            {
                "part": "left_thigh",
                "id": "left_thigh",
                "invertAxis": "xy",
                "translate": [3, -6.5, -4.7],
                "mirrorTexture": "u",
                "submodels": [
                    {
                        "id": "bone2",
                        "invertAxis": "xy",
                        "translate": [-4, 3, 4],
                        "rotate": [0, 90, 0],
                        "boxes": [
                            {"coordinates": [-7, 1.5, 6.5, 8, 7, 3], "textureOffset": [10, 22]}
                        ]
                    }
                ]
            },
            {
                "part": "right_thigh",
                "id": "right_thigh",
                "invertAxis": "xy",
                "translate": [-3, -6.5, -4.7],
                "mirrorTexture": "u",
                "submodels": [
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [-4, 3, 4],
                        "rotate": [0, 90, 0],
                        "boxes": [
                            {"coordinates": [-7, 1.5, -1.5, 8, 7, 3], "textureOffset": [10, 22]}
                        ]
                    }
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -9, -9],
                "boxes": [
                    {"coordinates": [-4, 8.5, -3.75, 8, 8, 14], "textureOffset": [10, 0]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [3, -7, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 0, -4.75, 2, 11, 3], "textureOffset": [0, 11]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-3, -7, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -4.75, 2, 11, 3], "textureOffset": [54, 14]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2.5, 13, -7.25, 5, 5, 6], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "right_ear",
                "id": "right_ear",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0.7, 18, -2.25, 2, 2, 1], "textureOffset": [0, 3]},
                    {"coordinates": [0.7, 20, -2.25, 3, 10, 1], "textureOffset": [56, 0]}
                ]
            },
            {
                "part": "left_ear",
                "id": "left_ear",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3.7, 20, -2.25, 3, 10, 1], "textureOffset": [40, 0]},
                    {"coordinates": [-2.7, 18, -2.25, 2, 2, 1], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -7.75, -8.75],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1.5, 10.75, 10.25, 3, 3, 2], "textureOffset": [0, 25]}
                ]
            },
            {
                "part": "nose",
                "id": "nose",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-0.5, 15.5, -7.75, 1, 1, 1], "textureOffset": [16, 0]}
                ]
            }
        ]
    }`
}
EntityOptions.melon_golem = {
	name: 'Melon Golem',
	texture_name: 'melon_golem.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGnmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTAzVDIyOjU0OjM2WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDMtMDNUMjM6MjA6MTFaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTAzVDIzOjIwOjExWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5NDFlMDA1Ni0yOTIxLTU3NDMtYmE4OC03M2EzMjk0YWM1NTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MGUyZDYxNDMtNWM0My0xNjQyLTg2M2QtZTk0ZTY3YzUyODc1IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MGUyZDYxNDMtNWM0My0xNjQyLTg2M2QtZTk0ZTY3YzUyODc1Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowZTJkNjE0My01YzQzLTE2NDItODYzZC1lOTRlNjdjNTI4NzUiIHN0RXZ0OndoZW49IjIwMjAtMDMtMDNUMjI6NTQ6MzZaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjE5YjBkOGY5LWEzNDctZTA0Zi05NGNiLThiYWY4MWY4YmM4YiIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0wM1QyMzoxNjo1MloiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTQxZTAwNTYtMjkyMS01NzQzLWJhODgtNzNhMzI5NGFjNTUwIiBzdEV2dDp3aGVuPSIyMDIwLTAzLTAzVDIzOjIwOjExWiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoRIq0wAAAmISURBVHic7Z1PaB1FHMe/m6ZGm1h8QYRXm9JgqUIgl4okVfRg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',
    model: `{
        "texture": "melon_golem.png",
        "textureSize": [64, 64],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -20, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 20, -4, 8, 8, 8], "textureOffset": [0, 0], "sizeAdd": -0.5},
                    {"coordinates": [-4, 21.5, -4, 8, 8, 8], "textureOffset": [32, 8], "sizeAdd": 1.1}
                ]
            },
            {
                "part": "left_hand",
                "id": "left_hand",
                "invertAxis": "xy",
                "translate": [-15, -18, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [4, 16, -1, 12, 2, 2], "textureOffset": [32, 0], "sizeAdd": -0.5}
                ]
            },
            {
                "part": "right_hand",
                "id": "right_hand",
                "invertAxis": "xy",
                "translate": [5, -18, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-16, 16, -1, 12, 2, 2], "textureOffset": [32, 0], "sizeAdd": -0.5}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 11, -5, 10, 10, 10], "textureOffset": [0, 16], "sizeAdd": -0.5}
                ]
            },
            {
                "part": "body_bottom",
                "id": "body_bottom",
                "invertAxis": "xy",
                "translate": [0, 0, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -6, 12, 12, 12], "textureOffset": [0, 36], "sizeAdd": -0.5}
                ]
            }
        ]
    }`
}
EntityOptions.midnight_chicken = {
    name: 'Midnight Chicken',
    texture_name: 'midnight_chicken.png',
    texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFCGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDMtMjZUMjI6NTk6NDZaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTI2VDIyOjU5OjQ2WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NDUxMDk4YS04OTc5LTM4NGEtYTM4Mi1mYjgw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',
    model: `{
        "texture": "midnight_chicken.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 9, -6, 4, 6, 3], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -8, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 4, -3, 6, 8, 6], "textureOffset": [0, 9]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "right_wing",
                "id": "right_wing",
                "invertAxis": "xy",
                "translate": [-4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "left_wing",
                "id": "left_wing",
                "invertAxis": "xy",
                "translate": [4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "bill",
                "id": "bill",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 11, -8, 4, 2, 2], "textureOffset": [14, 0]}
                ]
            },
            {
                "part": "chin",
                "id": "chin",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 9, -7, 2, 2, 2], "textureOffset": [14, 4]}
                ]
            }
        ]
    }`
}
EntityOptions.moobloom = {
    name: 'Moobloom',
    texture_name: 'moobloom.png',
    texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAIwWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAyLTI2VDE1OjQ4LTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMi0wMVQyMTozNzo0NloiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDItMDFUMjE6Mzc6NDZaIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmI1M2E3ZWQyLWFmMzQtNWY0Ni1hYTAxLWUwNTZjYTQ2ZDEyNCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjRmMWIwYjczLTk0MzMtMmQ0NS1hN2E1LTMyYmE5MzUxYTVlZiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjZjNmUwMDk2LTFjZjctMzk0My05MmNkLTk2N2U5MjBmOGM5MyI+IDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDxyZGY6QmFnPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0ZjFiMGI3My05NDMzLTJkNDUtYTdhNS0zMmJhOTM1MWE1ZWY8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6NjBiOWVkZWItNjc1YS1jYjRkLTg5ZTYtNjg1YmRjYTk5YTNkPC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjdhODlkMmE0LTEyY2MtMmU0MS05ODgwLWJlYWVjZmRhNDQ2YTwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4MDk5ZTE0Yy0zYjFhLThkNDEtYWZmZS1kMGVkNTVjNmZlY2I8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6YTZmMWIwZjgtYzljMy00ODQ2LWJiYzYtNzJiY2E1ZGJjYTc4PC9yZGY6bGk+IDxyZGY6bGk+eG1wLmRpZDpjMzA1YTIzOC1iYWM3LTM2NGYtODE4ZS1mYzFiYTE0NDI3ZWI8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2YzZlMDA5Ni0xY2Y3LTM5NDMtOTJjZC05NjdlOTIwZjhjOTMiIHN0RXZ0OndoZW49IjIwMTktMDItMjZUMTU6NDgtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NGQ5YTEzYmYtNDk2NC00NzQwLWI3NWItYzFkMDA5OWFkNGNlIiBzdEV2dDp3aGVuPSIyMDE5LTA0LTA4VDE0OjE1OjM0LTA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmI1M2E3ZWQyLWFmMzQtNWY0Ni1hYTAxLWUwNTZjYTQ2ZDEyNCIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0wMVQyMTozNzo0NloiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6u0AqPAAAGuUlEQVRoga1ZTWwTRxT+7E0WF2N1i6oq4GKQEjVKEwkBBUFpcCVMb5XgUq7pkVwirkhuI63EoZfKl7acQFVP7YFDJVBJLoE2Qi0UcaBuqoQqq7pxUECL3IUoaNke1m/8ZnZmbQifZHl2ZnbmvZlv3s9sJooiAMCNX+6A47C9P7Ly0CIMWHlwTpStpbIo24eQcV03mp+fx9WrVzPXf/4dAHDsg/36QTcJGh8ADv7zV9f+udOnAQB9pg4m5aktDICWD2xl9eHgHJ7cLqPgAOfPn4/GxsZgWRbGx8cjAJmuUr0CbLt9AyiVAAC5kye79s9udsInt8uJupYPeJ6HK1euwPM8eJ632Wl6xkiphIszMz33NzKAsDEQU9xulhEGHWa0/E4fa302rrvnirrl5eWehXjV+PTEiZ77pi4AKU9lfsY5uOIAUHCAXbt2aSn/9OFcBMA4FtCxK9ZSWbIxBP4ubUgYxLYlxOUXOmrGIxAGnZ3lgoVB3FZw5B+Bl02w1mfR8mUWAbEypJA6d2KMvGynqFz3PFycmUG9x2OX2fgVCWtPVt7KA6FTRZirCKEs3xV9dIaS13NvYeUBvwEURquwfDcuO0kF1Pk5C1UZgDYzWV323SiVAeTtxo/uAwD0kUW3Vn/E3fv3AQBjR6Y6E/ou4EAsAhfw7mwN8/U6BkslHK+cS/Uc0ngAnGJSYdHHMI6qfOhU4/9cBXAgtQEAHk8Dr09LVaQ4IQvEVPS3fIz+/n7Ytg0AsA8B1mhHaLtZBhourNG4DQBs28aHe/fi0HvnzBozFBwlhmA7bUK3oyDGYhuEBx9FeDwd9fKeZAR3Dk1iZelrszAaQXcMnkHB0belBVL8DHOa203FODZc2HllZ1mbVUwq/3xtBmEwg/53Pu8af2TCe4iA+HwCMCrTC9Qz32s7tzPkbgEAxWqspLJQiUVSQPalf/cJ4K1rqQuQpcmcoqw81f+9ZVH6Ub16boGkVeeg/i2/E0kSLN8VVOfKSztLfddnE3OTZwoDYOd0Dk6xrfyW97u6xMzDa4h0ux4GgLd9EUNDQ5iYmAAAXLp0CYuLiyg9GoqFYYvFlVetO1d+64G5hDGTFFeUp9Cah98cfK6WDxy/9TZW7qzB2VMAgMyfXzyQ+g988hqa3z8Vz330YoEJTGg2m5iYmMDq6ioAiIUwCs4EIcG48uKdXAUI9OdaF/i0fAA+sDW4LOUeNL5VPCXGX7mzlnH2FIxnf8e+N6XnjCkbJHz37TeJugsXLiTq1h9djyO89u7yhWn5sf9XKU27260fwVqfBRrxwuliDd3iiXcpemyzK7f9WAZ4gWSo0Wj01E8ETczKF5xkuEz1ieeGK7k+XuZji3Ze1rhMa30WdrMc99PYlUQucPSN/cJ/hgFw6odt+LL2FQDg7NQk1h61uhqW0KmKM85tgLU+K0WVxve5kMzVWUvldA+luEWJjQajmpoMvbQ7VCIzKw/AJxa4MSN8c95AdBWUbriw4JojRH4cNHGDlQc2DMcqcQR0kdrLgK/2xsAcCqNVqb2npEnJ+kKnmsgN1NiCxwwbA3MiXDZBywBV8bNTk92lNUCK12GI6FIgeRRlF4naG7mKMJBpeYT2CDz797MozFVwcKQ9KDq5OACs/PSf9MKz3zIRp1z/wfTsy2TRewG5NpqPR4BhIFv9MFeBVQRAx65tY8Qx1CR1AJDVWV1dqEn0UqM4E2gM+u81qdEhEfk5Va3LC3MVwTjLdxPBViJbRDsdRnt1eCfJelPKnO88838VkusK0m9/CKlGUY1SU1hlTI2ZbPz9THgPkelyoxfQBcTzPzIRJTUqg9JCZaDTllZvSp7SkJY0kdxZoLPD3aid5iHCgN0b8Po2XVUvQOALYyqrMO2uCWl6ZTnNdddSpnKvtoB2SrdjOiVNim/GJaexO0uD69LctHrdwDohuT1QWbBcr8UJTvu3XK9huV6T7IE4FsWq5Ne7Xppq2sOgzUgWG4grMa6ALu2kfpTP8/4kYDg4lwhApFy/zQIaR/2IcXNhQa8NC2NFmOu7xkXQpdt8HM7GLCmaRsc0A0ZIBCltl0ThqUlY/hHj8PAwRtqftRLpsw4NN84P2Nh2s6y9azAZzixX6kUWw8QSaeJcpfMlSZMNcqTd45uyQxGbtI2vzt0KVhsWsY+fNf6xQl0UXkeTF5AOur4SEZ3Cgrrn4ebCAg4PDwOIjwAxgBBf1sTJEM1rnM9kk4rmfKDvyJkDXdRIYmoq/m5Qq9Vw65ZBGHZ5IRZXwwJO+5FSCXXPw+4RuQ8ZxW4XrYDhoiQlZvgfbLd229NkFQoAAAAASUVORK5CYII=',
    model: `{
        "texture": "moobloom.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [18, 4]}
                ],
                "submodels": [
                    {
                        "id": "body_sub_2",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "mirrorTexture": "u",
                        "rotate": [90, 0, 0],
                        "boxes": [
                            {"coordinates": [-4.5, 5, -22.5, 4, 6, 0], "textureOffset": [52, 8]},
                            {"coordinates": [-5.5, 5, -13.5, 4, 6, 0], "textureOffset": [52, 8]},
                            {"coordinates": [0.5, 5, -23.5, 4, 5, 0], "textureOffset": [52, 8]},
                            {"coordinates": [1.5, 5, -14.5, 4, 5, 0], "textureOffset": [52, 8]},
                            {"coordinates": [-2.5, 5, -24.5, 0, 6, 4], "textureOffset": [52, 4]},
                            {"coordinates": [-3.5, 5, -15.5, 0, 6, 4], "textureOffset": [52, 4]},
                            {"coordinates": [2.5, 5, -25.5, 0, 5, 4], "textureOffset": [52, 4]},
                            {"coordinates": [3.5, 5, -16.5, 0, 5, 4], "textureOffset": [52, 4]}
                        ]
                    }
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -20, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -14, 8, 8, 6], "textureOffset": [0, 0]},
                    {"coordinates": [-5, 22, -12, 1, 3, 1], "textureOffset": [22, 0]},
                    {"coordinates": [4, 22, -12, 1, 3, 1], "textureOffset": [22, 0]},
                    {"coordinates": [-1.5, 24, -13.5, 0, 6, 4], "textureOffset": [52, 4]},
                    {"coordinates": [-3.5, 24, -11.5, 4, 6, 0], "textureOffset": [52, 8]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.pig_mottled = {
    name: 'Mottled Pig',
    texture_name: 'pig_mottled.png',
    texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHPWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDQtMDJUMjM6NDc6MDkrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDQtMDJUMjM6NDc6MDkrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDRiZGM3OWYtNTdhMC02MDQ1LTlmYWUtMDE3NzRkODE1YmNkIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM1NmJiOTc1LTk2MmQtNjk0ZS04MjZhLTZlYWVlMGRjYzE1OSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjM1NmJiOTc1LTk2MmQtNjk0ZS04MjZhLTZlYWVlMGRjYzE1OSI+IDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDxyZGY6QmFnPiA8cmRmOmxpPnhtcC5kaWQ6MzU2YmI5NzUtOTYyZC02OTRlLTgyNmEtNmVhZWUwZGNjMTU5PC9yZGY6bGk+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MzU2YmI5NzUtOTYyZC02OTRlLTgyNmEtNmVhZWUwZGNjMTU5IiBzdEV2dDp3aGVuPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjMmJhZDgwOC0wYmM5LWQwNGQtYjMyZC04MzJkNWM2NDQ3YTAiIHN0RXZ0OndoZW49IjIwMjAtMDMtMjZUMjI6MjQ6NTJaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ0YmRjNzlmLTU3YTAtNjA0NS05ZmFlLTAxNzc0ZDgxNWJjZCIgc3RFdnQ6d2hlbj0iMjAyMC0wNC0wMlQyMzo0NzowOSswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRv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',
    model: `{
        "texture": "pig_mottled.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -13, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 7, -5, 10, 16, 8], "textureOffset": [28, 8]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 8, -14, 8, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-2, 9, -15, 4, 3, 1], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.muddy_foot_rabbit = {
	name: 'Muddy Foot Rabbit',
	texture_name: 'muddy_foot_rabbit.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAEvElEQVRogcVZzW8bRRT/Odl1kll2t44cRWlShapCCCrl0ApoJVSEkIy4IeASJBDi0AsS/0DFuafeOVBx4MCFAzckJC5c+BIcKgECFFErdosby+nuxkPiTbUc3De8He/as7bj/CRrPvfNe2/em/dmXIIhfvjmq6S6tj7Q377fzJz/wiuvlUxp63jQ3E30vijYH5h34dmtzDVevLyVAICwLQDA19//UsrrN2Zy57c7CQAsCgeHsqtKoK+E6tp6qjRVQJIkyd69BlbOboDKbhQOzGs16qq+KBwAwPqTFwbWqF251BeybEH2jkeuP2fCJF+U16nULSPLUoZBHkT48K0a5EE0kgfORx5E2cLtt99PtQHg8/euqzqVlimTtl0GBOAvVxF02soKCK5fyayPQjcKUV1bx81Pv1BtAJibn1dzlpjgtl0GAMRxL5MeCaa3RdnCP0Ew0GdsAbR40GkrJmy7rBgjhly/ksucCRzXg+N6WBKO+tFatC61s3BuxQcAJeywOUABFwAA4Xpq4dWNTSUod4lxhCehHddTfbe3r6XKlbMbEK4HweY07+4kB2GQ+nEBaae5wFSn0vgQJOIyChHHPeUKQN8tZBRCuB5ajToWhZN5QA2jy4UHgHeeewqVzfPYr/+Nz376C0DfPeRjF+FRYVE4ih9a9/VrzyfnVnzs7gVoPeyqud/d+TXFVyELAJDaAW6GvN9frhrTI4G6UZg6/Sub51Wpj+lWdii7qShRBIUtgJgW2o4FnTb85SpajTpWNzbxhOcb0W7e3UmAvjKF6ymFZCGOe6nQm4WPbtyAKFvKxHf3+mcBhURyiy+//bEEjKkAE5gqAACubl1UtHUTLYralUsJCSl7x6l8IJJHWD3jQPaOVXJk8QxPD19Zu8zBfZ/GyS0eNHcTvmN5eLX2EgBgr3OvuLQZiOQRInkEAHDFAmTvWLUBoPWwC1csqHaJZ3gEEozATZP8jwTNU1Ke4DyDBPLT2VlBHYKHsqtiLZ30cdwbEFCPxxwyCtWYnrHpPmuS0c0CSgF6DOfKAAZ3mvfJKETQaSul0Q6TkCR8+34TjZ0/AUCVpw0L6DNKO0fx1fUrKQH1JITAzwAZhep7oneIQVfgCjltKP+jU/6N2ssA/r9Cmo5z0LlCMPVzfh75y9VCkWRcFE6ETFHkQsS/mfXZUNLj+zCfz0LWLtGDBrmDqQVQ6ARw+hYwLCOj8VFzxkFehDkpzJEQPM7TLuhjutC5d/KcA3MU6JtZKqHE3990gfjjg84UhTvu63lRAsh+06Nv+Xc8kmRh2onTXBTsQx7FAIAP3t0G0E+KKJaToNe331QKyktxuXXo1jLsUGw16ifmUqNQ4peHcXDr408ApHeT77rrV3J3n8ZprgmmbQEWMHhVHPaamvfamidAnhKobSr4SWEibV7dupj04r4yyrY19lWWrsNE6+ff/5jZBWmiRIgLPw1Mi04RTLTiNBmet+fxKH40NXqmmFgCelzgjw7j0oBtIZKTclQME7kAf1nh9aLgUWj1zGzvAhNZgEnUKEpr1phoVc9ZelxOzgjRmjVGhpvLzzyd0GHnigW1UzrDYfdfVac/IihKcCyJBfX3tChbQ+nQkzbHtEPkfxKViriFJFQZAAAAAElFTkSuQmCC',
    model: `{
        "texture": "muddy_foot_rabbit.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "left_foot",
                "id": "left_foot",
                "invertAxis": "xy",
                "translate": [3, -8, -6.2],
                "boxes": [
                    {"coordinates": [2, 2, 2.5, 2, 1, 7], "textureOffset": [26, 24]}
                ]
            },
            {
                "part": "right_foot",
                "id": "right_foot",
                "invertAxis": "xy",
                "translate": [-3, -8, -6.2],
                "boxes": [
                    {"coordinates": [-4, 2, 2.5, 2, 1, 7], "textureOffset": [8, 24]}
                ]
            },
            {
                "part": "left_thigh",
                "id": "left_thigh",
                "invertAxis": "xy",
                "translate": [3, -6.5, -4.7],
                "boxes": [
                    {"coordinates": [2, 3, 4.5, 2, 4, 5], "textureOffset": [16, 15]}
                ]
            },
            {
                "part": "right_thigh",
                "id": "right_thigh",
                "invertAxis": "xy",
                "translate": [-3, -6.5, -4.7],
                "boxes": [
                    {"coordinates": [-4, 3, 4.5, 2, 4, 5], "textureOffset": [30, 15]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -9, -9],
                "boxes": [
                    {"coordinates": [-3, 6, -1, 6, 5, 10], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [3, -7, 1],
                "boxes": [
                    {"coordinates": [2, 0, -2, 2, 7, 2], "textureOffset": [8, 15]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-3, -7, 1],
                "boxes": [
                    {"coordinates": [-4, 0, -2, 2, 7, 2], "textureOffset": [0, 15]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "boxes": [
                    {"coordinates": [-2.5, 8, -6, 5, 4, 5], "textureOffset": [32, 0]}
                ]
            },
            {
                "part": "right_ear",
                "id": "right_ear",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "boxes": [
                    {"coordinates": [0.5, 12, -2, 2, 5, 1], "textureOffset": [58, 0]}
                ]
            },
            {
                "part": "left_ear",
                "id": "left_ear",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "boxes": [
                    {"coordinates": [-2.5, 12, -2, 2, 5, 1], "textureOffset": [52, 0]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -7.75, -9],
                "boxes": [
                    {"coordinates": [-1.5, 6.25, 9, 3, 3, 2], "textureOffset": [52, 6]}
                ]
            },
            {
                "part": "nose",
                "id": "nose",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "boxes": [
                    {"coordinates": [-0.5, 9.5, -6.5, 1, 1, 1], "textureOffset": [32, 9]}
                ]
            }
        ]
    }`
}
EntityOptions.muddy_pig = {
    name: 'Muddy Pig',
    texture_name: 'muddy_pig.png',
    texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHLmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTExLTA0VDIwOjI5OjM5WiIgeG1wOk1vZGlmeURhdGU9IjIwMTktMTEtMDdUMTU6MzY6NTdaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTExLTA3VDE1OjM2OjU3WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMmFlNzVmNy1kMzgwLWFjNDYtYTM1MC02MjgxNWQzN2ZlM2UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NmNjZTIwMjItYzMyMS01MjRkLWFlMDktMjU1Mzk3MzdkYWQ3IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NmNjZTIwMjItYzMyMS01MjRkLWFlMDktMjU1Mzk3MzdkYWQ3Ij4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDo2Y2NlMjAyMi1jMzIxLTUyNGQtYWUwOS0yNTUzOTczN2RhZDc8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2Y2NlMjAyMi1jMzIxLTUyNGQtYWUwOS0yNTUzOTczN2RhZDciIHN0RXZ0OndoZW49IjIwMTktMTEtMDRUMjA6Mjk6MzlaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjUxY2E1MGMzLTYwMjgtNGU0Yi1iYjA4LWFkNzg2MWI2ZjUzOSIgc3RFdnQ6d2hlbj0iMjAxOS0xMS0wNFQyMDo0MDoxOVoiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDJhZTc1ZjctZDM4MC1hYzQ2LWEzNTAtNjI4MTVkMzdmZTNlIiBzdEV2dDp3aGVuPSIyMDE5LTExLTA3VDE1OjM2OjU3WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFu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',
    model: `{
        "texture": "muddy_pig.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -13, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 7, -5, 10, 16, 8], "textureOffset": [28, 8]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -12, 6],
                "boxes": [
                    {"coordinates": [-4, 8, -14, 8, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-2, 9, -15, 4, 3, 1], "textureOffset": [16, 16]},
                    {"coordinates": [-3, 16, -13, 4, 1, 4], "textureOffset": [0, 26]},
                    {"coordinates": [-4, 17, -11, 4, 6, 0], "textureOffset": [16, 20]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.pale_pig = {
    name: 'Pale Pig',
    texture_name: 'pale_pig.png',
    texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGrWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDQtMDJUMjM6NDE6MTYrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDQtMDJUMjM6NDE6MTYrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZjBlODBlODMtYjQyMy03NzQxLWJiZGMtMGExOGQxYmU5YTY4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM3MWM4MmQ3LTM2NzMtODc0My1iNzIzLTk0ZTdmMGYwOTc1ZCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjM3MWM4MmQ3LTM2NzMtODc0My1iNzIzLTk0ZTdmMGYwOTc1ZCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MzcxYzgyZDctMzY3My04NzQzLWI3MjMtOTRlN2YwZjA5NzVkIiBzdEV2dDp3aGVuPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2ZjlkMDVlOC1kYTlkLTAxNDMtYTI1MC01YzUyYjM5OGQ4OGQiIHN0RXZ0OndoZW49IjIwMjAtMDMtMjZUMjI6NDk6MzVaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmYwZTgwZTgzLWI0MjMtNzc0MS1iYmRjLTBhMThkMWJlOWE2OCIgc3RFdnQ6d2hlbj0iMjAyMC0wNC0wMlQyMzo0MToxNiswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pn/nNzAAAAVASURBVGiBzVlNaBtHFP5WsTWWRWynCEzRpXIPLaX0kkN6sk/poXGhoYWGQgkNTsGQtIeeeopvOQXTJhDahFxCwSWEYipcSE6WLulBl15aaJFNqQSlG9vIXcsjG08Pu280M5rdHclO4g+EZlfz87733rz3ZuQJIZCE9WpFAEBmJKe9P9htAwD+q68ljgfgAUC+UMDU7Gxa3+eOoX4653KhEtrttvOYfLGIqbNn+5PqOcJJAZmRnCQ/zBgAoI2uF+QLBeu4wPcBzlEvlwHgWHpAJrWD4fp7nGu/SfKMdT8RzN/qjx8fgchHCycPIOub7+RWUEhrz5zL9nHdBqkeYMOwStgkr4IxeCwLj2WPpfUBRwW4BD0iSh8bXJSwVlk9kj6ucM4CpISxiQnsca4pxUbYY1kI3gEAlKZnDivnM4O3VlntKQTMwNcPKDPYoM5L/UrTM57aZ62yKkhxcTAVbpuXQPOT95mxSHpAZiQnB8eRSFrIBYOMGXRe4pO27YYE78BjWTmJ4B2Ac3hjJ8Pn1jYAwBs7qS2kvpfPUdCTfSJLxsUEwTsQN7/R3q1D3z6ueHT/DgDgnU8uA9CVkpSBhkgQVcjA95FHSO79azew8sN32Gs2NULZ11/Dux99huXFBYjWdjimWASge1MqrlzVn6uVxO4kpyrzo/t3JPF7t7/GpfkvZJ/S77/1KFnOdfVzZKAUNhqi9La8uIC9ZlMuTovuNZtYXlzQ+hIOdtvSQ0gQE3EWTvIalTw4l30nX54C0Es+lpuCDJWrqkD5YjHWbW3wWFZaXyURNBraO/XjOm9aahW8g1enpiB4B59emtfmD3w/dY1uHRApIWkxF2FFaxvgXC4eNBp2S3CuKciUI85ryLJkOHCOfLGIoNFA0Gjg12pVzuOCIUDXlFa/K+Rs0ISMFrRpnd7R3EmWCXw/7MdYrxKMNWRfzuXcb0XPLtYHorO6inq5LNRFfnpSxYXZ81gq/4gLs+dROneuZ0zwxxOx83RDPv9bb+Cf9fCeYPKVEt74+LIcQ/cLkpxiqR5DmGW2QUw7hRoZSEXcXQYQUwm6ag8A/v75oWCn9AXGTr2kkbZBpjrGpBI074vcWztYIYxPmntHv6dtW/VAFygKSDwLxJ3zVbQ2N7D8YAV8s40DkcPygxW0NjcSx5BFZLyxWHpny8fOVnefa88Gksirdxnm+kCMB7gQV/Hehx9o7adrf/Y1Pg5iHyHpqO05nlyoDrGRB6KjPMKt4NGeB6C5k22PAkrgidpvXrzo3f3yCgBg7sYtqG0bKAZoRC05WyUOdMmPTrjte6Br/WHGtIscIDzcdRWQMJGmCGW/EmxBMQkuCiDyq7/UMH36NACgUqth5kzYlkow5FYr0CTyQFcBGRt5Nf3I32ifMobA9/sKlHFQY4HtYoUIm+2jQC6XQ2YkFwZB0dqWpEkoUwlSEWrETroNckDaeYHc32z3M5/N+irCLBB5AZE/MT6OE+PjujCkEMbCVHRI8i6o1GrW9qAYtsicoTRDBL+/96381ryB8jLnWHq4JL+vz88dWrA4pG6BBOu6eoMMYGn/EMXh+vwcvrp917m/LQgCeiA0MwDBNROkpUFCsLkx2K3wM4FhHbHfuwXEvkH+EKA7zUN7AG7ddO7615m3cbDblv81mrdQKna2fKsH9CggxQMA+/8asg4YmDgJ5fVVBoAuYV0VQG5PbZsCgPhyOG4bdOuAFwSNfAS1thidKISEJ4sYnSzayQNScbb7A1Ky+b8GkQfw4jzALLVTj8IE5Ujcc2aJqWht1/ykgP8BkiUlILUo6uUAAAAASUVORK5CYII=',
    model: `{
        "texture": "pale_pig.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -13, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 7, -5, 10, 16, 8], "textureOffset": [28, 8]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 8, -14, 8, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-2, 9, -15, 4, 3, 1], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.piebald_pig = {
    name: 'Piebald Pig',
    texture_name: 'piebald_pig.png',
    texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAA7EAAAOxAGVKw4bAAANq2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTEyLTA2VDEzOjUxOjEzLTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNC0wMlQyMzo0NDozNyswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNC0wMlQyMzo0NDozNyswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjMTNjMjZiNS00NGNkLWNlNDAtYjE3Yi02MjY4MTYyMDFlNTIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDozMTUyMzI1My03YzI2LTI0NDItYTIxNC01OGY0MjA0Y2U3NDciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiYWNlMzgzZi00MmFkLTdjNDItYmI3ZS1hMGM4MDM5ZjU0MTkiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249Ijk2MDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iOTYwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI2NCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjY0Ij4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjMxNTIzMjUzLTdjMjYtMjQ0Mi1hMjE0LTU4ZjQyMDRjZTc0NzwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0ZDdiZmRjYi01OTI5LTYwNGQtYWM1MS0yYTNlOTQ2M2Q1Njk8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6NmVjOTVlZmMtNWRlZi1jODQwLTg0NDAtYjg4ZGNmZDhkOWNkPC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjlmZjVmYWI2LTdmMWYtYWU0Yy1iMzA2LTQ5ODg3YWQ1YTIwMjwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkN2ViZWFkNS0zMmQ2LTg1NGUtYTNiYy0xY2MwNTZmZWFmMjg8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiYWNlMzgzZi00MmFkLTdjNDItYmI3ZS1hMGM4MDM5ZjU0MTkiIHN0RXZ0OndoZW49IjIwMTktMTItMDZUMTM6NTE6MTMtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL3BuZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphZDQ5ODhmNi1mY2EyLTQ5NGYtYjM3Ny1jZDRkMDBlN2IwOTAiIHN0RXZ0OndoZW49IjIwMTktMTItMDZUMTU6NDQ6MDMtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MmVhZTgwYjItN2E0Yi04MjQxLTg0N2UtOTcxZWYxMmJiYTllIiBzdEV2dDp3aGVuPSIyMDE5LTEyLTE3VDE1OjU3OjM5LTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmIwNDVjNDhjLWFlNjItMTY0NS1iNmU3LWMwZmEyMDc2OGFhYSIgc3RFdnQ6d2hlbj0iMjAxOS0xMi0xN1QxNTo1NzozOS0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjMTNjMjZiNS00NGNkLWNlNDAtYjE3Yi02MjY4MTYyMDFlNTIiIHN0RXZ0OndoZW49IjIwMjAtMDQtMDJUMjM6NDQ6MzcrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MmVhZTgwYjItN2E0Yi04MjQxLTg0N2UtOTcxZWYxMmJiYTllIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YjYyNzUwODQtOTAxOC03ZDRkLTkwNzUtODVhZDdiOTYzZjY4IiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YmFjZTM4M2YtNDJhZC03YzQyLWJiN2UtYTBjODAzOWY1NDE5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bEfRdgAACdJJREFUaIHVmWtsHNUZhp+57+6sHRubYEJoU1JEKCRK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',
    model: `{
        "texture": "piebald_pig.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -13, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 7, -5, 10, 16, 8], "textureOffset": [28, 8]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 8, -14, 8, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-2, 9, -15, 4, 3, 1], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.pink_footed_pig = {
    name: 'Pink Footed Pig',
    texture_name: 'pink_footed_pig.png',
    texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHVmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDQtMDJUMjM6NDk6NTErMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDQtMDJUMjM6NDk6NTErMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjU3NTYwMzctZTllMy0xMTQ1LWE5YTYtOGY1YzIyOTU4ZjIxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjZhNzE5ZmQ0LWZhNTUtMDY0My1iMjM4LTRkNWZmYzFiZjc1MCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjZhNzE5ZmQ0LWZhNTUtMDY0My1iMjM4LTRkNWZmYzFiZjc1MCI+IDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDxyZGY6QmFnPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0ZDdiZmRjYi01OTI5LTYwNGQtYWM1MS0yYTNlOTQ2M2Q1Njk8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6NzIzMDk5MWItYjY5Yi05NjQyLWE2ZDQtZjZiMmMwOTBjNDFhPC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmQ3ZWJlYWQ1LTMyZDYtODU0ZS1hM2JjLTFjYzA1NmZlYWYyODwvcmRmOmxpPiA8cmRmOmxpPnhtcC5kaWQ6ODIzMDcwYmUtNDAxMC1iODQ3LThmZmQtYTlkZDgwZjQxYWU0PC9yZGY6bGk+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NmE3MTlmZDQtZmE1NS0wNjQzLWIyMzgtNGQ1ZmZjMWJmNzUwIiBzdEV2dDp3aGVuPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NTc1NjAzNy1lOWUzLTExNDUtYTlhNi04ZjVjMjI5NThmMjEiIHN0RXZ0OndoZW49IjIwMjAtMDQtMDJUMjM6NDk6NTErMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2Jl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',
    model: `{
        "texture": "pink_footed_pig.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -13, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 7, -5, 10, 16, 8], "textureOffset": [28, 8]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 8, -14, 8, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-2, 9, -15, 4, 3, 1], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.moobloom_pink = {
    name: 'Pink Moobloom',
    texture_name: 'moobloom_pink.png',
    texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGrWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDQtMDJUMjM6MzA6MDUrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDQtMDJUMjM6MzA6MDUrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YjI5Y2QxY2QtZGVmNS1jMDQxLWI4NzgtYWQzZWZmZWFhYjRiIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM0ZGM3YWZhLTdjZmYtZDc0ZC1hZWVhLWZkNzRjMDUxOTYyOCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjM0ZGM3YWZhLTdjZmYtZDc0ZC1hZWVhLWZkNzRjMDUxOTYyOCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MzRkYzdhZmEtN2NmZi1kNzRkLWFlZWEtZmQ3NGMwNTE5NjI4IiBzdEV2dDp3aGVuPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowZDAwYzM1MS1iYjFlLTEyNGItOThjNS02MDU1ZDc3YzY0YTUiIHN0RXZ0OndoZW49IjIwMjAtMDMtMjZUMjE6NTU6MTlaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmIyOWNkMWNkLWRlZjUtYzA0MS1iODc4LWFkM2VmZmVhYWI0YiIgc3RFdnQ6d2hlbj0iMjAyMC0wNC0wMlQyMzozMDowNSswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Plp7+c0AAAZBSURBVGiBzVlPaBxlFP/Nug2exOBk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',
    model: `{
        "texture": "moobloom_pink.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [18, 4]}
                ],
                "submodels": [
                    {
                        "id": "body_sub_2",
                        "invertAxis": "xy",
                        "translate": [0, 0, 0],
                        "mirrorTexture": "u",
                        "rotate": [90, 0, 0],
                        "boxes": [
                            {"coordinates": [-4.5, 5, -22.5, 4, 8, 0], "textureOffset": [52, 6]},
                            {"coordinates": [-5.5, 5, -13.5, 4, 8, 0], "textureOffset": [52, 6]},
                            {"coordinates": [0.5, 5, -23.5, 4, 7, 0], "textureOffset": [52, 6]},
                            {"coordinates": [1.5, 5, -14.5, 4, 7, 0], "textureOffset": [52, 6]},
                            {"coordinates": [-2.5, 5, -24.5, 0, 8, 4], "textureOffset": [52, 2]},
                            {"coordinates": [-3.5, 5, -15.5, 0, 8, 4], "textureOffset": [52, 2]},
                            {"coordinates": [2.5, 5, -25.5, 0, 7, 4], "textureOffset": [52, 2]},
                            {"coordinates": [3.5, 5, -16.5, 0, 7, 4], "textureOffset": [52, 2]}
                        ]
                    }
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -20, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -14, 8, 8, 6], "textureOffset": [0, 0]},
                    {"coordinates": [-5, 22, -12, 1, 3, 1], "textureOffset": [22, 0]},
                    {"coordinates": [4, 22, -12, 1, 3, 1], "textureOffset": [22, 0]},
                    {"coordinates": [-1.5, 24, -13.5, 0, 8, 4], "textureOffset": [52, 2]},
                    {"coordinates": [-3.5, 24, -11.5, 4, 8, 0], "textureOffset": [52, 6]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.pinto_cow = {
    name: 'Pinto Cow',
    texture_name: 'pinto_cow.png',
    texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF4mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDQtMDNUMDA6MDE6MDcrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDQtMDNUMDA6MDE6MDcrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YzgzNDhlN2ItY2ZhNi1hZDQxLThiZDMtOGVlNmU5MjFhZGFhIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhlNDU2NTJlLTIwY2ItMGI0Yi1hZmQ2LTQ3MDUyYmJiOWNjOSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjhlNDU2NTJlLTIwY2ItMGI0Yi1hZmQ2LTQ3MDUyYmJiOWNjOSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OGU0NTY1MmUtMjBjYi0wYjRiLWFmZDYtNDcwNTJiYmI5Y2M5IiBzdEV2dDp3aGVuPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjODM0OGU3Yi1jZmE2LWFkNDEtOGJkMy04ZWU2ZTkyMWFkYWEiIHN0RXZ0OndoZW49IjIwMjAtMDQtMDNUMDA6MDE6MDcrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5kPfGUAAAKjElEQVRogc2Zf4wcZRnHPzPzzq/du96151FaztLW8kODlFANUDUxwWCMkURJ1EopJW29UltRhChgEVpSEDCFFtpemoMCVhATCGiNhISQkFAgFlOI2AZoS3O2nHfH9e52d37P+MfszM7sj7trjcbvZjK77+/v8zzv8z7Pu1IURTTD4OH9kSwrtHd0AHBsVy+qqlMenwBg1rJ7MNtmpO1dx07frmNx3mXfkj46sD966amd/PChJ6Wmk/yXMPrqS81JNYHUSgBD778VmYZOKClomso/+3+M5zkAuJbLrGX3YFll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',
    model: `{
        "texture": "pinto_cow.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [18, 4]},
                    {"coordinates": [-2, 11, -6, 4, 6, 1], "textureOffset": [52, 0]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -20, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -14, 8, 8, 6], "textureOffset": [0, 0]},
                    {"coordinates": [-5, 22, -12, 1, 3, 1], "textureOffset": [22, 0]},
                    {"coordinates": [4, 22, -12, 1, 3, 1], "textureOffset": [22, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.rainbow_sheep = {
	name: 'Rainbow Sheep',
	texture_name: 'rainbow_sheep.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAJqmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTAxVDIyOjIyOjA1WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDMtMjZUMjM6Mjc6MDJaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTI2VDIzOjI3OjAyWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyNGFjMmQ2Mi1hZDAzLTQ3NDQtYjVkNS1iZWY4N2FmYzI2YTQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplNmQ1NjBlNS02YmU3LWMwNDMtYjA0OC1jZWVjYmE1NzMxZTkiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphN2Q5NzUxZS00YmQ3LTczNDItOWVmNS1iZGZlYzQ0MWNkYWEiPiA8cGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8cmRmOkJhZz4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6MWVkYTJlYmYtMGJmOS0yNzQ4LTlmOWQtYjU5MjcxYmM0MjE5PC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjIyZTFmOWYwLTYzMTgtYjQ0MC1hNTg1LTUyMTNmYTYyODdiMDwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo3OWZhNTk2OC0wMDBhLTg2NDAtYTUwYS0xOGI3ZjhjZGYzMTc8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6ODQzYzEwMzgtNmU1Ni03YjQ1LWE4Y2YtZjc3NDMzMGE5OThkPC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjlhYmE1NDQ0LWM4ZTQtNWU0Yi04Y2FjLWRhZDM3MTY5NGVlNzwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDphMzRlYTkyMC0yOTk5LWM5NGMtYjQ1Yi0zOWIwZWI3ZDZkYWM8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6YzIyNGNkOTQtMDU0OS02ZDQ2LWE5OWUtZDI4NjgxMWQ2MDI5PC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmU2ZDU2MGU1LTZiZTctYzA0My1iMDQ4LWNlZWNiYTU3MzFlOTwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmYmYxNmM5Ni1lMjVhLTE4NDYtOTMwZC1kMjdjMmJhYjM4Mjk8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphN2Q5NzUxZS00YmQ3LTczNDItOWVmNS1iZGZlYzQ0MWNkYWEiIHN0RXZ0OndoZW49IjIwMjAtMDItMDFUMjI6MjI6MDVaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjk2M2NkYzI3LTNhYjktY2Y0Zi1hZjk3LThiNjk3OGRiY2QwMyIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0yNlQyMzoxNDozMloiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjRhYzJkNjItYWQwMy00NzQ0LWI1ZDUtYmVmODdhZmMyNmE0IiBzdEV2dDp3aGVuPSIyMDIwLTAzLTI2VDIzOjI3OjAyWiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ppf0sRcAAA0bSURBVHic7Zp/cB3Vdcc/e/fu7tt9+1aSbWEjCL8GCHUIZspQwC0QmMJMkklCy8+WpC4Ylw72uDb4BxgH29gYyz8xY7u4aRNIQnAhTUlhCE3rSWlJwqQ4McEJjcFgg1EkJNvSat/u29/94+kpT7JkYkGQlfF35o3e3t17dc73nHvOuWefkuc5R8J8RcltXcGLcmxdAcCLclomNADgum7/PcdxmNvZrRxxwWMMEmBDcyOu69IyaSKeH9DW1UPLhAbmdnbTMqEB2zLx/ACAtq6efiIAHMeBPhJw3dHR4gNAApy5ZBZSSpI0RaoqfyAN/LIHVC0MYFsmbe0d1LzB6yPCcZyBJIwxSIA33nqHkyeOQ9d1vHJEHFZ4t+s31qx6RNXaNSIcx+knp4bathhLkPUXFd8jTbPDHqopZltm/1ht79d7wmBCxgIEgLvpG7x3yOPG8z/LX17wOTq6ffxHnuh/qK2rB9d1aWvv6I8FNXevV37MbgGAKIrYtW8fhmEMeKAW4WuRf3DUr6EWB8YalPdLg8sMkdf2PsDut9sPywJtXT0AtcwxptKgMg/ymkItkyYCVF09yjn7lEl4fjBkirQts5+M+nn126G2bs1T2rp6WJPnxxRBsj5y7367ndZnnuGVN9/EGx/z8pzlw6bIfSs2c9mmxZyln8I5p5/O/KuuGnKLuK7bXzvUe86xAum67oAIvvEHT3HVmRfT6x4A4Ib56wiCgO8+tBCvHHH9gg0oisL6CQ3ElQqpmrLmma8B1czgOA61yNBfQ/SR0dbVw1dOPTGfsqkVzSgA0H3gPXbOXszFW9cSxxHlnoMoQiWOQoQQGGaRcrlMU1MTj8812Nr+NwqAogwk8/228nDo3wL1Ac11XS7ZtIwfz1qCM+tLnDxxHFkS9afId7tc/Eee4PzW+excuGbA3Po1BgdL13X5029uQWg6KIIsjvjlXUs4d+MDxGGFJEmo9B6icXwzQVDhyQU21608iFAlTy6sGukJf96HSoAY7JZtXT04jsMvFq2rCn2EFPnmA1sHBMHafOgrmgYp7zgOcRxxoPM9XrptDlmW4fkBWRyxY9Yi9ix6kByFLMvQdL1qIVVDK1jcsNrjhtXeiJQ8EmR9egMG7GOouu9QKbK+CKqfX69s/fmg9j0OK9hWAdsyUQVMeeh+0izjoi0rSbOcLIkJwwjDtLh5Y4JmNGHbNkG5jNPY9KET8JFHpfUTGvJzW+9m18JVXLRlJQXTwg8qbP/iHVzx2MP0dLWjSAOnaTyaVHl0psLNGxNUVfL1WXzoMUB8cJWGRp7nQ35sy0TVDM5bs4jA99kx8x6isMIVX9+EUTDRCxaP31mtOcIw5C82xDz+dxKhCm79+w/fXocVQp9Tlg4Y8KY+x6Lpf04URaz9xrP84Ic/GSDFYEvU8L1N9+YAplUEIPDLiGIj+19/laLdQJrElP/xacbP/iJaoYBp2eQopH51ywyeJ3UDTWoIIVAUhV/ceR8AF2xdT1gJuOSaW0fEzpAeYJs2tmkPGAuC4OgWLjYiio2EikaoaMQIwrJL+s3v4z7yFHFUwfMDNEMn9MsEvsfepRvIVI0wzeg6dAi3XOa1pZvYt2Qdhm6QJhEV3yNJYjw/YPL65UhVIKV8f4GOhgDoi+J9JGiGiW3bwz06JAqmxfk/vQ8lS/B7ukiTiI+9sBzzls9WFdd1Tr9nBmmaoigKcaVC853T6D3YSdd7HVy6dxOf2PkA5zwwj1OX3UXxydtJkwTyjCxNuGDTSs56YTb2P98EWfrhEjA4ry/b8jitj373qBY+54fz+Nl5i5my834Aznu1lT0Xz0OoGs7t12IWG5i6dzO6lERhiJAqU/c8zBXtX6WpaRxQPX4nSYKu67jXbkZVBaf/z3wmv3Q3cRwDsO9TGzjQ0XbUitcgb5/0D7nruniBR8vElsNc/+w9t1F/v/75Pgy5916/dD0y8HnprLk0N0+EV0HTC4Rlj+YJE0izjBdOvp3Lf7WeHZPnc8Ev1/Dy5IVousEJBQPvtYC3Ll3DRTvu41dTV3PSf8xk/1WbsS2T/5u6Gk0ReH7Aqf81t/oPZ9w7IgJELWfbpk1bR9uAsrj/YNOnfA1e4GGb9oCxw6CIqvUKFnEYYFsmUhX09hzk3F2r+eO9m7l8/1Z2fmIhSZJW+wx5xpSd9+P2dLNn6oOgCHb+4XI+/qMFvH3lRgDeuPwhzvnRAtI44q3L1hFdqVO4ZsKIlAcQNUs6jkPLxBYGnw1q41BX25v2kOVvPbI04ZLTNgEwSbuPlycv5PyPbcFpbGJ70414fsD3nOvpeq+dwOtlx9lziKKQ1y68HyF1dF0nSRLOnbCKXRetQgiBrmmc27SCXX+0ElXTQVHYfehuft5+58gJqHf5mrXr/w51r768HXZhVfK/++dw3okP8fqhBaRJzE/23EYcRegFkxeabwZFABlJHJElEVd+8luc1dRKlib45V6iis8b5WVEYYUz7WWkWU5bewdS0zmzuATTtGieeOIHqhDlZ+7aRVCpULRLmHYjQqqkqU+x1IBmCLLkIDkKqtSIQw3bMfHcToQQZDlsmzH0wr7nQpawq30O/yQXc2P3HIoFA/KMqFIhT1MIA8DhqouexbZM/v3laxnffAJnOEv7SX7DW4IC7O5diqZBl/YwZCkr0hgvns2tWSthGI2YAKEIgSYlUtNJ0wQpJbqukSURqqoiVImiKKiqQFVVkqgCiqBSqZDFlWEX/temFQhVkuVwh1xJg+Pw/GmPoBsFFFWi6jovXvgseZrwb/95Gf+y/QrisEIYp/3d55++O4cz7WXYpRJCKAgpMUwLrWDh+QG35msQUse0rJETYFpFrFIjimagGQZ5DmmcEEUhvnuQwC+TJjF5mpBmOUEQ0Nvbiyq1Iy58o7+cx/R7kVLi+z7bGldx9d6/pRL4/PeUp5Cazuf3Tqdgmvz8iu1YxRKaYaIoCivSmBd3T+e5SWvY7X6Zrckc1nfPJEsSoqCMJhSmxQ9y/V2dZGkyYuUBRLlcxvd9dF1HqBLNMJGGQankoOk6WRLilz3CMCSJKvR0H6Sgq2RJiJTqsAtLzWB6vpo0y9E0jVdWr0OVGsu//UleWb2Ogllk+ZOTefA75zH1Z9ehaDornjgDVVX5swN38+yJG/h850K+qszHtkzmlDZyxwMRf7W4l0Odv0YK+Pba8YSBTyXwR0yATDMoNTSi5NXOcLlcxjRNfv3ufsY3N/ddW7S37Wfc+PEYRoFez0dKyTvv7B924TRNSJIUyy5Rdrtpa+9AFYKV0/ah6zp+Be7/0l5mPlRCERIlz1l80xvAJFAE1xy4hyxPuKlnEXqlAAZsWSRJU5Nr53awrVVHFTl3rFaxLZOrbxkZAcIumlT8MmkckkYRhlQhzzAMg3KvR6nkoKoqkyZNQmoGTuM4Wk46mVKpxCmnnjbswnHFRzMKRGHIwi0NPLZEgiIQquT5tedgmAWiJGXDzENIvYCuG6AoaLpBHIXcfK+HKjWmLUtIkgRFyL5mSc621mrUr1QqrJ/Vw9rZI/cAEScZVtEmjGIyckBB0zQMq4hVcpBSoqgaqmYghKgqoYCU8oiHkOeWTcQ0dJ5cYLN2ts/21WdgWSZxkvLpe97kx5un8J2lJ4HUKDU2kSTVM7/f240QgqfWNRPHMdtam9ALFt+aIzFMk0LRRtN1kiRGFQp2wziSId5m/baQX3l+x1FPWjzjOrIsO+L54AsP9rLtzhKu20GaVOv2NIPGcdU6/wvLu/D9kN6eHPKMYkMThmEQBAFW0SbJMiy7hBCCW5YEbFnlEZQThBB4bg+GYZBlGaqUPL3A5tO3jYyAw/oBL35GGTDw5Z4Lj9gPGA7ff3QtAFf/9byRSfYRYeh+gF391ONo+wFjBcNu4v5Sv6fWDzi6M/exbvkahiRg8Dln2ZbHPwpZRgXKnunkrgueBy0t1S52jYDa9/r7tXGvrx3wJ88dW+/6jhaipqRtQ1vbbxSGoZWH6rVtDxwbqxA1SzrOQA+oJ6He8lBV/n3aAWMGsj7a17t2PTGD79WPjXXIVz8+7bB+QEeaUSw1EBomnUlU1w8IwGmk3e3u7weMdfzO+gFjBdK0imiGhaLpaLre3w9I0xTcg2RUXzxIVZBmOUkQ4JV9LMuCLB5t+T8wZLlcJs2gqdnu7wcoQmAWCmR5TuCX8cOqpZM4wvN6KRaLZEmIoR+5KTIWIKRmMOGEiSh59T2fX+4lSRIOdnWSxNX+gFDg0IFOsizFcRpQpY5RsEjSsR8EpCYFPYcOYlkWlUoFTZOgVAvEWj8gz3OamprIEBgFE1VVCfzy70UQlP39gDAEVaXWDxCqREoNoUCSgaoZkKYD+gHDvRkeS1A+NfXCo7bj4hnXkSQJq7729G99PD5W8b4/lPx9x+/sFyJjBccJGG0BRhvHCRhtAUYbxwkYbQFGG8cJGG0BRhvHCRhtAUYbxwkYbQFGG8cJGG0BRhv/D2AzZhEea3YgAAAAAElFTkSuQmCC',
    model: `{
        "texture": "rainbow_sheep.png",
        "textureSize": [64, 64],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 13, -5, 8, 16, 6], "textureOffset": [22, 10]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -18, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 16, -14, 6, 6, 8], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3, -12, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -7, 4, 12, 4], "textureOffset": [0, 32]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3, -12, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -7, 4, 12, 4], "textureOffset": [0, 32]}
                ]
            }
        ]
    }`
}
EntityOptions.rainbow_sheep_wool = {
	name: 'Rainbow Sheep [Wool]',
	texture_name: 'rainbow_sheep_fur.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAJjmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDIzOjIxOjU0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDMtMjZUMjM6NDI6NDFaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTI2VDIzOjQyOjQxWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplMzNlMTFiOS1jMjg2LTZmNGYtOWNiZC02N2RmYTZkNTY1NDAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Y2YxMmMzMTEtZWE0Yi1kNjRkLTk1OTgtYTc5ZWE1OTIyZWNhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6Y2YxMmMzMTEtZWE0Yi1kNjRkLTk1OTgtYTc5ZWE1OTIyZWNhIj4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjFlZGEyZWJmLTBiZjktMjc0OC05ZjlkLWI1OTI3MWJjNDIxOTwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDoyMmUxZjlmMC02MzE4LWI0NDAtYTU4NS01MjEzZmE2Mjg3YjA8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6NzlmYTU5NjgtMDAwYS04NjQwLWE1MGEtMThiN2Y4Y2RmMzE3PC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjg0M2MxMDM4LTZlNTYtN2I0NS1hOGNmLWY3NzQzMzBhOTk4ZDwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5YWJhNTQ0NC1jOGU0LTVlNGItOGNhYy1kYWQzNzE2OTRlZTc8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6YTM0ZWE5MjAtMjk5OS1jOTRjLWI0NWItMzliMGViN2Q2ZGFjPC9yZGY6bGk+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmMyMjRjZDk0LTA1NDktNmQ0Ni1hOTllLWQyODY4MTFkNjAyOTwvcmRmOmxpPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmYmYxNmM5Ni1lMjVhLTE4NDYtOTMwZC1kMjdjMmJhYjM4Mjk8L3JkZjpsaT4gPHJkZjpsaT54bXAuZGlkOmNmMTJjMzExLWVhNGItZDY0ZC05NTk4LWE3OWVhNTkyMmVjYTwvcmRmOmxpPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8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',
    model: `{
        "texture": "rainbow_sheep_fur.png",
        "textureSize": [64, 64],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 13, -5, 8, 16, 6], "textureOffset": [28, 8], "sizeAdd": 1.75}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -18, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 16, -12, 6, 6, 6], "textureOffset": [0, 0], "sizeAdd": 0.6}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 6, 5, 4, 6, 4], "textureOffset": [0, 16], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 6, 5, 4, 6, 4], "textureOffset": [0, 16], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3, -12, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 6, -7, 4, 6, 4], "textureOffset": [0, 30], "sizeAdd": 0.5}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3, -12, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 6, -7, 4, 6, 4], "textureOffset": [0, 30], "sizeAdd": 0.5}
                ]
            }
        ]
    }`
}
EntityOptions.skeleton_dog = {
    name: 'Skeleton Dog',
    texture_name: 'skeleton_dog.png',
    texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAA7EAAAOxAGVKw4bAAALDWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAyLTE5VDE3OjQ0OjIyLTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0xMS0xMVQxMDoxNDozNS0wODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0xMS0xMVQxMDoxNDozNS0wODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NzZiYTVmYy05NTEyLTkyNDAtYTAyYi1lNjM2MWUyNzY0OWIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiMzA1YTNkNi04N2I3LWJmNDYtOWQ1OS1mZWM4NGIwNzA5MDEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0YjFkNzZmOC1jYmJiLWFkNDMtOGE3Yi00M2JmZDc5Y2QzYWQiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249Ijk2MDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iOTYwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI2NCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjMyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0YjFkNzZmOC1jYmJiLWFkNDMtOGE3Yi00M2JmZDc5Y2QzYWQiIHN0RXZ0OndoZW49IjIwMTktMDItMTlUMTc6NDQ6MjItMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL3BuZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplOTY2N2VhNS05YTkzLTUyNDEtYTYwMC1mNDg1YjYyOWExMWEiIHN0RXZ0OndoZW49IjIwMTktMDItMTlUMTc6NTg6NDQtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZmJlOWQ2N2YtNzBkMS00NTRkLTg5ODAtMzA3MGIwNjc3ZWIwIiBzdEV2dDp3aGVuPSIyMDE5LTExLTExVDEwOjE0OjM1LTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjU3NmJhNWZjLTk1MTItOTI0MC1hMDJiLWU2MzYxZTI3NjQ5YiIgc3RFdnQ6d2hlbj0iMjAxOS0xMS0xMVQxMDoxNDozNS0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpmYmU5ZDY3Zi03MGQxLTQ1NGQtODk4MC0zMDcwYjA2NzdlYjAiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2NTZkMzY2NS1lNjNkLWVhNGQtYTY1OC1lYzYxZWRhOTNmMmUiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0YjFkNzZmOC1jYmJiLWFkNDMtOGE3Yi00M2JmZDc5Y2QzYWQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz44gB6PAAADWElEQVRo3u1Zy23jMBRkJS7CXbiTbAMB0kCwHbgCnxbpwA0EOfrkswthNAKHGD5TFEWJ2kNymFgiqSe+4fsqznvvFH9eXvwEnF1bwuPx8MDX56fnNXG73Uacz2d/uVxG4D7MRxmcG4DrRe+vxdMANpXDUgLu97sHSADvg/IOGOQ6KgcIOck4wbmuBGDDAF7G64BFgvnc9XpN5JQIwByeLRDgdiGAJkq0EEDzBQEA70uyMEcCcvNdCIB/c2PqpznfxRjWtsQEYxmTcz2ULBLw9/09IeB0Ovnj8RjvcY0xJQDPDGh64ce/Dz9g8Vx3AmCmJOBwOETfxTUJoCmvJQAybJDF2H8hAH+gEBUu+S7usTY8M5sCNeVRFhQEENTeXl89wGAYxse1fC4nS2NMiA1xvJUAV3uiXFtDgCqvJ60EW6K5rkSCzvEac60ukGAQOAm7dkooN8Z7Pq9FjVpAmCO8LXpE4TFABnkkb7xvDZxPp6qngpMIJuotATVVICEnHBXNWEBCAmNSDmoVer1JHQCBCHr4RVACAUuDEy0AZS2I4y9dQE9OoC6QPKcWgLFgCXQBx/HNCIDSawjQ02HwDMrx9CehFsCibFcLCELH36D4JukpWEBCgJ0nAbQAFEz0efq/WMDTdRMBGnGFVWejLk2z0gIiIAuKUDm1NMrWqM4+QAlQeV0IwAmrIPsyzJcIAFGDq2RP1J60sbSkYSL5u1eCegq5HM4CaIqAXCEyp4iktdgg9Wh3aywg+py1AM27XFfq0izmukV9R3AT32rKaywgFkDYCIsTS8BU/gcprQQEqyMB8X73XiDXx/f6BGXdQF1uT8WTIKh1OjZiurWaHj8JfmodBQuI7lNj9r1cI6ZBLTyY9mosIQQxJwFTvy0WCcAaEqDVHut/9hM93cJZ5Vmn1xCgNT4juqbMEgGMHZKGvTY1pt3tS0AIQDEN2c6tVN2RNA2aqBpriyasw3pb0GhqXVPo1BAQv9MBbEC0dq+xgK03tqsLkABtKCpdIFrA1hvTBqc7Adp/639t5gIZc/dUuduaGvVbgA2O3dKgtpv8EMLvdbbO1/QXNunW5HOtB0io9vtbk5wthfUjBP9rQ5QIkE9SSVHDCD5XDeb6j4mxfSrBn4ZfAn46Ad8VBD7UJ5Ex7AAAAABJRU5ErkJggg==',
    model: `{
        "texture": "skeleton_dog.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [-1, -10.5, 7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 7.5, -9, 6, 6, 4], "textureOffset": [0, 0]},
                    {"coordinates": [-4, 13.5, -7, 2, 2, 1], "textureOffset": [16, 14]},
                    {"coordinates": [0, 13.5, -7, 2, 2, 1], "textureOffset": [16, 14]},
                    {"coordinates": [-2.5, 7.52, -12, 3, 3, 4], "textureOffset": [0, 10]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -10, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 3, -1, 6, 9, 6], "textureOffset": [18, 14]}
                ]
            },
            {
                "part": "mane",
                "id": "mane",
                "invertAxis": "xy",
                "translate": [-1, -10, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 7, -1, 8, 6, 7], "textureOffset": [21, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-2.5, -8, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3.5, 0, 6, 2, 8, 2], "textureOffset": [0, 18]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [0.5, -8, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-0.5, 0, 6, 2, 8, 2], "textureOffset": [0, 18]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-2.5, -8, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3.5, 0, -5, 2, 8, 2], "textureOffset": [0, 18]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [0.5, -8, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-0.5, 0, -5, 2, 8, 2], "textureOffset": [0, 18]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [-1, -12, -8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 4, 7, 2, 8, 2], "textureOffset": [9, 18]}
                ]
            }
        ]
    }`
}
EntityOptions.skewbald_chicken = {
	name: 'Skewbald Chicken',
	texture_name: 'skewbald_chicken.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF3WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTEyLTE2VDA5OjI0OjQyLTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMy0yNlQyMzowMDozOVoiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDMtMjZUMjM6MDA6MzlaIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmZhZmY3OWJmLWM2ZWEtNDU0MS1hMzY1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',
    model: `{
        "texture": "skewbald_chicken.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 9, -6, 4, 6, 3], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -8, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 4, -3, 6, 8, 6], "textureOffset": [0, 9]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "right_wing",
                "id": "right_wing",
                "invertAxis": "xy",
                "translate": [-4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "left_wing",
                "id": "left_wing",
                "invertAxis": "xy",
                "translate": [4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "bill",
                "id": "bill",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 11, -8, 4, 2, 2], "textureOffset": [14, 0]}
                ]
            },
            {
                "part": "chin",
                "id": "chin",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 9, -7, 2, 2, 2], "textureOffset": [14, 4]}
                ]
            }
        ]
    }`
}
EntityOptions.sooty_pig = {
	name: 'Sooty Pig',
	texture_name: 'sooty_pig.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGrWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDQtMDNUMDA6Mzc6MzArMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDQtMDNUMDA6Mzc6MzArMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTVlNzYyMWUtYWI1Zi1mYjQ5LTkwNGItOWY4ZjQ0ZmU0NTcwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOmUwYWY5ODVhLTU3ZTQtMzE0Yy04M2I4LTMxMjkwYjc3ZTQzNCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmUwYWY5ODVhLTU3ZTQtMzE0Yy04M2I4LTMxMjkwYjc3ZTQzNCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZTBhZjk4NWEtNTdlNC0zMTRjLTgzYjgtMzEyOTBiNzdlNDM0IiBzdEV2dDp3aGVuPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiMmE2NzZhMy1iMjRiLTg2NGMtODc1NS1mYzBhNWJhZDUwYWEiIHN0RXZ0OndoZW49IjIwMjAtMDMtMjZUMjI6NDY6NDRaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjk1ZTc2MjFlLWFiNWYtZmI0OS05MDRiLTlmOGY0NGZlNDU3MCIgc3RFdnQ6d2hlbj0iMjAyMC0wNC0wM1QwMDozNzozMCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv35PyUAAAadSURBVGiB3ZlLbBtFGMd/G+/6kbUd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',
    model: `{
        "texture": "sooty_pig.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -13, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 7, -5, 10, 16, 8], "textureOffset": [28, 8]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 8, -14, 8, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-2, 9, -15, 4, 3, 1], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.spotted_pig = {
	name: 'Spotted Pig',
	texture_name: 'spotted_pig.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAOI2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA5LTA0VDE2OjIzOjQ0LTA3OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNC0wM1QwMDo0NDozNSswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNC0wM1QwMDo0NDozNSswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpiYjhmMThhMi04NGM4LTViNDMtODI2My00YTdjNzNkNDNiMjMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0ZDdiZmRjYi01OTI5LTYwNGQtYWM1MS0yYTNlOTQ2M2Q1NjkiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphNWI3NzdmMi04OTc1LTVhNDgtYjJlYS0yNmM1NmJjN2JjMDYiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI2NCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjMyIj4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmQ3ZWJlYWQ1LTMyZDYtODU0ZS1hM2JjLTFjYzA1NmZlYWYyODwvcmRmOmxpPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmE1Yjc3N2YyLTg5NzUtNWE0OC1iMmVhLTI2YzU2YmM3YmMwNiIgc3RFdnQ6d2hlbj0iMjAxOS0wOS0wNFQxNjoyMzo0NC0wNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiMzBiNTMzMy0zZjYyLTA4NDEtODU2Mi0xMDdlZmViYmI2YWEiIHN0RXZ0OndoZW49IjIwMjAtMDEtMDlUMTA6NTM6MDMtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZTI5OTkyNWQtNTNhZS0zYTQ2LTg0M2EtZTdjZjUyMzdlMTBlIiBzdEV2dDp3aGVuPSIyMDIwLTAxLTA5VDEwOjUzOjAzLTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGltYWdlL3BuZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozMTc5YWM2Ny1mNDY4LTM2NDItYmVkNy00ZmViOGI5ZDZhNDUiIHN0RXZ0OndoZW49IjIwMjAtMDEtMTBUMTU6MjE6NDQtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjQzYzBhYzEtMmVlYi0xMjQ0LWEzZjQtZGM3MDQ3ZmZjNzVhIiBzdEV2dDp3aGVuPSIyMDIwLTAxLTEwVDE3OjUwOjMyLTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjJlZGY3ZDA4LTYxNWMtZWI0YS1iN2U5LTQzMWI5MzAzMDJiOSIgc3RFdnQ6d2hlbj0iMjAyMC0wMS0xMFQxNzo1MDozMi0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiYjhmMThhMi04NGM4LTViNDMtODI2My00YTdjNzNkNDNiMjMiIHN0RXZ0OndoZW49IjIwMjAtMDQtMDNUMDA6NDQ6MzUrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YjQzYzBhYzEtMmVlYi0xMjQ0LWEzZjQtZGM3MDQ3ZmZjNzVhIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZDdlYmVhZDUtMzJkNi04NTRlLWEzYmMtMWNjMDU2ZmVhZjI4IiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTViNzc3ZjItODk3NS01YTQ4LWIy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',
    model: `{
        "texture": "spotted_pig.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -13, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 7, -5, 10, 16, 8], "textureOffset": [28, 8]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 8, -14, 8, 8, 8], "textureOffset": [0, 0]},
                    {"coordinates": [-2, 9, -15, 4, 3, 1], "textureOffset": [16, 16]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [3, -6, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, 5, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-5, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [3, -6, 5],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1, 0, -7, 4, 6, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.stormy_chicken = {
	name: 'Stormy Chicken',
	texture_name: 'stormy_chicken.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFCGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI4VDIxOjEzOjI0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDMtMjhUMjE6MTM6NDdaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAzLTI4VDIxOjEzOjQ3WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpiNDI0ZTdlNC1kZDExLTY0NGItOWUyMC0yMTczMTRkM2Y5YzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YjQyNGU3ZTQtZGQxMS02NDRiLTllMjAtMjE3MzE0ZDNmOWMzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YjQyNGU3ZTQtZGQxMS02NDRiLTllMjAtMjE3MzE0ZDNmOWMzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNDI0ZTdlNC1kZDExLTY0NGItOWUyMC0yMTczMTRkM2Y5YzMiIHN0RXZ0OndoZW49IjIwMjAtMDMtMjhUMjE6MTM6MjRaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+pcNA/AAAAyJJREFUaIHtlztLHFEUgL/ZHdSVnRmIEYKrlZAmRcA2ncFOmySFICgWgTQBf0EKy5AiIATBKiESqxTRTrAQJCA2gaQRJIW7Q9Qo7Mw+MGhuCrmTO9cZ3Ufc0ejXzNzXzjnnntcaQggMw0AIwcjDxwKgWi2SyTjs7Gyjsv513UBjdXJAbPltAPRbv/ied0PrE8s/Tp3R2ZweEndfLJ+77yJIGUb4u1L5Wnm9ZUa+18rm9JBQn60mUmJphLSZZvGWB8DIgR3aszo5IACm+v/OTVkAPQCBJ7wduiMg3hO8Qjt27hCv0N6MHg1jDA8+EtnOLAClSolqtQhAd1cOgL39QsgjpHGepNbq+lAtoQCw9vy+eDDzpWXhYEqFs51ZllY+Mjo8DsDC0jtGh8fJZJzAKNIQvyuHTHw+Uejn4L2Q695e+daU8G0dnc0crxuzXCkHA6m8fJce0S46OKju0y468HyPbqujpUJeJOatTBcHlf3YxFeulPGOPNJmmj1/F4A9f/fUzUvkfKOe4FjZRo41TGrP3+X46Dhw85nyBjPlDeAk3o+PjgGC5/9GUAXKlTKZTClYKFVKqOGh02ysx9HqfsAQIrr8zs7NC69YDM3levsAsKxwSfR9j7HRkUQamWZJxS1Ylo3tONhOODf4vhd6XnViWzd5y77vkevtC41V5fXxVePc3rWnpzd4V2/fKxbJ9fZdaeXhjBDwfQ/LsnHdfDCWyNxQyG+j54lamZ2bFy9fvUmk/1eJ9QBVYdfNY1l2cPM6jRhBT6RJYc4vLApVGDWm9VgHsB0Hy7LRz8wvLArVQDJ5Pns6FlkdpEGTJhVV0s5D36P+hu04seVS5zJ4QQpOl7azXFqu6WdUr5Dvl0HB8wglwXpcMmqvboRGfqPVGO8/fBJqPEbFsUSdVxWVFSOKs9bi9vu+F5s7/jWm2uBA2P3jQkGdl7euKyrHUqFa97WalCpgveiCR3WJ6j5ZTvU1182HZGi0t2gEUxWmng/rXhB1y66bD/apxlINpodSK5WHM/4NXhdiW+Hrwo0BkhYgaW4MkLQASXNjgKQFSJprb4A/cHzUSSpKMHoAAAAASUVORK5CYII=',
    model: `{
        "texture": "stormy_chicken.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 9, -6, 4, 6, 3], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -8, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 4, -3, 6, 8, 6], "textureOffset": [0, 9]}
                ]
            },
            {
                "part": "right_leg",
                "id": "right_leg",
                "invertAxis": "xy",
                "translate": [-2, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "left_leg",
                "id": "left_leg",
                "invertAxis": "xy",
                "translate": [1, -5, -1],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 0, -2, 3, 5, 3], "textureOffset": [26, 0]}
                ]
            },
            {
                "part": "right_wing",
                "id": "right_wing",
                "invertAxis": "xy",
                "translate": [-4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [3, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "left_wing",
                "id": "left_wing",
                "invertAxis": "xy",
                "translate": [4, -11, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 7, -3, 1, 4, 6], "textureOffset": [24, 13]}
                ]
            },
            {
                "part": "bill",
                "id": "bill",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-2, 11, -8, 4, 2, 2], "textureOffset": [14, 0]}
                ]
            },
            {
                "part": "chin",
                "id": "chin",
                "invertAxis": "xy",
                "translate": [0, -9, 4],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-1, 9, -7, 2, 2, 2], "textureOffset": [14, 4]}
                ]
            }
        ]
    }`
}
EntityOptions.sunset_cow = {
	name: 'Sunset Cow',
	texture_name: 'sunset_cow.png',
	texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF4mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDQtMDNUMDA6NTA6MzQrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDQtMDNUMDA6NTA6MzQrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZDA1OWI4OWItNjQzNi04MDQ2LWI3ZDMtYzkwOTFiYzc2YzEwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlmNDYzZTExLTE5ZmUtYzk0Zi1iYTg0LTEyNzA4ODNlYzg0MiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjlmNDYzZTExLTE5ZmUtYzk0Zi1iYTg0LTEyNzA4ODNlYzg0MiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OWY0NjNlMTEtMTlmZS1jOTRmLWJhODQtMTI3MDg4M2VjODQyIiBzdEV2dDp3aGVuPSIyMDIwLTAzLTI2VDIxOjQxOjE5WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkMDU5Yjg5Yi02NDM2LTgwNDYtYjdkMy1jOTA5MWJjNzZjMTAiIHN0RXZ0OndoZW49IjIwMjAtMDQtMDNUMDA6NTA6MzQrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz58DAWFAAAHLElEQVRogb2ZTWxcVxXHf+O+zrx588bD+COyRxNI3ZSmFKhoaJgSsYlUUZmoDVKlgrLpJrEqVsjqiopFF+wilpVhAZtKsCJCSRUakU3URdyEQCpIkEMLjetaaWxrPt6bGXdgung+b+69774ZO0r5SyO/j/vePf9z/ufcc58z7516BBPHzzYB+nJeKHgEQaiNKblO4jkVbz2fz7x25aH+2laLt57PZwC+/asPhj7zoBAuLfRHj4ownAUReYA3DnX5+a3cro04eaHdB6iUfU5eaPXFCV80wqWFvjdRIdxcA0CO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',
    model: `{
        "texture": "sunset_cow.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [18, 4]},
                    {"coordinates": [-2, 11, -6, 4, 6, 1], "textureOffset": [52, 0]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -20, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -14, 8, 8, 6], "textureOffset": [0, 0]},
                    {"coordinates": [-5, 22, -12, 1, 3, 1], "textureOffset": [22, 0]},
                    {"coordinates": [4, 22, -12, 1, 3, 1], "textureOffset": [22, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
EntityOptions.tropical_slime = {
	name: 'Tropical Slime',
	texture_name: 'tropical_slime.png',
	texture_data: 'data:image/png;base64,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',
    model: `{
        "texture": "tropical_slime.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3, 1, -3, 6, 6, 6], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "right_eye",
                "id": "right_eye",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-3.3, 4, -3.5, 2, 2, 2], "textureOffset": [32, 0]}
                ]
            },
            {
                "part": "left_eye",
                "id": "left_eye",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [1.3, 4, -3.5, 2, 2, 2], "textureOffset": [32, 4]}
                ]
            },
            {
                "part": "mouth",
                "id": "mouth",
                "invertAxis": "xy",
                "translate": [0, -24, 0],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [0, 2, -3.5, 1, 1, 1], "textureOffset": [32, 8]}
                ]
            }
        ]
    }`
}
EntityOptions.vested_rabbit = {
	name: 'Vested Rabbit',
	texture_name: 'vested_rabbit.png',
	texture_data: 'data:image/png;base64,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',
    model: `{
	   "texture": "vested_rabbit.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "left_foot",
                "id": "left_foot",
                "invertAxis": "xy",
                "translate": [3, -8, -6.2],
                "boxes": [
                    {"coordinates": [2, 2, 2.5, 2, 1, 7], "textureOffset": [26, 24]}
                ]
            },
            {
                "part": "right_foot",
                "id": "right_foot",
                "invertAxis": "xy",
                "translate": [-3, -8, -6.2],
                "boxes": [
                    {"coordinates": [-4, 2, 2.5, 2, 1, 7], "textureOffset": [8, 24]}
                ]
            },
            {
                "part": "left_thigh",
                "id": "left_thigh",
                "invertAxis": "xy",
                "translate": [3, -6.5, -4.7],
                "boxes": [
                    {"coordinates": [2, 3, 4.5, 2, 4, 5], "textureOffset": [16, 15]}
                ]
            },
            {
                "part": "right_thigh",
                "id": "right_thigh",
                "invertAxis": "xy",
                "translate": [-3, -6.5, -4.7],
                "boxes": [
                    {"coordinates": [-4, 3, 4.5, 2, 4, 5], "textureOffset": [30, 15]}
                ]
            },
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -9, -9],
                "boxes": [
                    {"coordinates": [-3, 6, -1, 6, 5, 10], "textureOffset": [0, 0]}
                ]
            },
            {
                "part": "left_arm",
                "id": "left_arm",
                "invertAxis": "xy",
                "translate": [3, -7, 1],
                "boxes": [
                    {"coordinates": [2, 0, -2, 2, 7, 2], "textureOffset": [8, 15]}
                ]
            },
            {
                "part": "right_arm",
                "id": "right_arm",
                "invertAxis": "xy",
                "translate": [-3, -7, 1],
                "boxes": [
                    {"coordinates": [-4, 0, -2, 2, 7, 2], "textureOffset": [0, 15]}
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "boxes": [
                    {"coordinates": [-2.5, 8, -6, 5, 4, 5], "textureOffset": [32, 0]}
                ]
            },
            {
                "part": "right_ear",
                "id": "right_ear",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "boxes": [
                    {"coordinates": [0.5, 12, -2, 2, 5, 1], "textureOffset": [58, 0]}
                ]
            },
            {
                "part": "left_ear",
                "id": "left_ear",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "boxes": [
                    {"coordinates": [-2.5, 12, -2, 2, 5, 1], "textureOffset": [52, 0]}
                ]
            },
            {
                "part": "tail",
                "id": "tail",
                "invertAxis": "xy",
                "translate": [0, -7.75, -9],
                "boxes": [
                    {"coordinates": [-1.5, 6.25, 9, 3, 3, 2], "textureOffset": [52, 6]}
                ]
            },
            {
                "part": "nose",
                "id": "nose",
                "invertAxis": "xy",
                "translate": [0, -8, 1],
                "boxes": [
                    {"coordinates": [-0.5, 9.5, -6.5, 1, 1, 1], "textureOffset": [32, 9]}
                ]
            }
        ]
    }`
}
EntityOptions.wooly_cow = {
    name: 'Wooly Cow',
    texture_name: 'wooly_cow.png',
    texture_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHLmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTExLTA3VDE0OjQwOjMxWiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDFUMjI6MDI6NDdaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTAxVDIyOjAyOjQ3WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NjU2MDI2Ni1mMWU1LTE5NGYtYTlhZi0yZTgxOTVlOTUwYjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YmViOTZkMTMtYzVkZC1kYzQ2LWE3YWQtMWE5YzZjY2M2MTJiIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YmViOTZkMTMtYzVkZC1kYzQ2LWE3YWQtMWE5YzZjY2M2MTJiIj4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDpiZWI5NmQxMy1jNWRkLWRjNDYtYTdhZC0xYTljNmNjYzYxMmI8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiZWI5NmQxMy1jNWRkLWRjNDYtYTdhZC0xYTljNmNjYzYxMmIiIHN0RXZ0OndoZW49IjIwMTktMTEtMDdUMTQ6NDA6MzFaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjMyYjk2YTM3LTUwYzgtZTQ0ZC1hMzliLTgzM2MwYzkzNTgzOSIgc3RFdnQ6d2hlbj0iMjAxOS0xMS0wN1QxNDo1NzozMloiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NjY1NjAyNjYtZjFlNS0xOTRmLWE5YWYtMmU4MTk1ZTk1MGI0IiBzdEV2dDp3aGVuPSIyMDIwLTAyLTAxVDIyOjAyOjQ3WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFu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',
    model: `{
        "texture": "wooly_cow.png",
        "textureSize": [64, 32],
        "models": [
            {
                "part": "body",
                "id": "body",
                "invertAxis": "xy",
                "translate": [0, -19, -2],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 11, -5, 12, 18, 10], "textureOffset": [18, 4]}
                ],
                "submodels": [
                    {
                        "id": "body_sub_0",
                        "invertAxis": "xy",
                        "translate": [-2.5, -1, 34],
                        "mirrorTexture": "u",
                        "rotate": [-90, 90, 0],
                        "boxes": [
                            {"coordinates": [39, -6.5, 30, 3, 8, 0], "textureOffset": [52, 6]}
                        ],
                        "submodels": [
                            {
                                "id": "bone3",
                                "invertAxis": "xy",
                                "translate": [40.5, -2.5, 12],
                                "rotate": [-180, 0, 0],
                                "submodels": [
                                    {
                                        "invertAxis": "xy",
                                        "mirrorTexture": "u",
                                        "boxes": [
                                            {"coordinates": [-1.5, -4, 0, 3, 8, 0], "textureOffset": [52, 6]}
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "id": "bone",
                        "invertAxis": "xy",
                        "translate": [-6, 29, -6],
                        "rotate": [0, 0, 90],
                        "boxes": [
                            {"coordinates": [-17, 0.01, -2, 16, 0, 3], "textureOffset": [26, 0]}
                        ],
                        "submodels": [
                            {
                                "id": "bone2",
                                "invertAxis": "xy",
                                "translate": [-9, -12.01, -0.5],
                                "rotate": [0, 0, -180],
                                "boxes": [
                                    {"coordinates": [-8, 0, -1.5, 16, 0, 3], "textureOffset": [26, 0]}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "part": "head",
                "id": "head",
                "invertAxis": "xy",
                "translate": [0, -20, 8],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-4, 16, -14, 8, 8, 6], "textureOffset": [0, 0]},
                    {"coordinates": [-5, 22, -12, 1, 3, 1], "textureOffset": [22, 0]},
                    {"coordinates": [4, 22, -12, 1, 3, 1], "textureOffset": [22, 0]}
                ]
            },
            {
                "part": "leg1",
                "id": "leg1",
                "invertAxis": "xy",
                "translate": [-4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg2",
                "id": "leg2",
                "invertAxis": "xy",
                "translate": [4, -12, -7],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, 5, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg3",
                "id": "leg3",
                "invertAxis": "xy",
                "translate": [-4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [-6, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            },
            {
                "part": "leg4",
                "id": "leg4",
                "invertAxis": "xy",
                "translate": [4, -12, 6],
                "mirrorTexture": "u",
                "boxes": [
                    {"coordinates": [2, 0, -7, 4, 12, 4], "textureOffset": [0, 16]}
                ]
            }
        ]
    }`
}
})()
