; Inno Setup Script untuk Aplikasi Bel Sekolah Otomatis Mandiri

#define MyAppName "Bel Sekolah Otomatis Mandiri"
#define MyAppVersion "1.2.0"
#define MyAppPublisher "Tim Bel Sekolah"
#define MyAppExeName "BelSekolah.exe"

[Setup]
AppId={{D37E6B21-7A91-4961-A7E2-9F051C47E3B2}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\BelSekolah
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
OutputDir=d:\BelSekolah\dist
OutputBaseFilename=Setup_BelSekolah_v1.2.0
SetupIconFile=d:\BelSekolah\launcher\app.ico
UninstallDisplayIcon={app}\{#MyAppExeName}
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
DisableWelcomePage=no

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
Source: "d:\BelSekolah\BelSekolah.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "d:\BelSekolah\launcher\app.ico"; DestDir: "{app}\launcher"; Flags: ignoreversion
Source: "d:\BelSekolah\firmware\data\*"; DestDir: "{app}\firmware\data"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "d:\BelSekolah\microsd_audio\*"; DestDir: "{app}\microsd_audio"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "d:\BelSekolah\README.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "d:\BelSekolah\DAFTAR_BELANJA.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "d:\BelSekolah\PANDUAN_TRANSISI.md"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\launcher\app.ico"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon; IconFilename: "{app}\launcher\app.ico"

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
