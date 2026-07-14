import { hasFlag } from 'country-flag-icons';

const flagAssetModules = import.meta.glob<string>(
  [
    '../../../../../../node_modules/country-flag-icons/3x2/MX.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/US.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/CA.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/DE.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/FR.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/AR.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/BR.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/GB.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/NL.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/CH.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/ES.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/KR.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/JP.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/ZA.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/CI.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/CO.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/EC.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/NO.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/MA.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/AU.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/EG.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/AT.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/BE.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/BA.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/QA.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/SE.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/TN.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/IR.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/NZ.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/UY.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/CV.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/SA.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/DZ.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/GH.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/SN.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/IQ.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/JO.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/CD.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/PT.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/PY.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/TR.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/CZ.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/HT.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/CW.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/HR.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/UZ.svg',
    '../../../../../../node_modules/country-flag-icons/3x2/PA.svg',
  ],
  { query: '?url', import: 'default' },
);

const flagUrlCache = new Map<string, string>();

const FLAG_ASSET_ROOT = '../../../../../../node_modules/country-flag-icons/3x2';

function resolveFlagModuleKey(flagCode: string): string | null {
  const moduleKey = `${FLAG_ASSET_ROOT}/${flagCode}.svg`;
  return flagAssetModules[moduleKey] ? moduleKey : null;
}

export async function loadFlagUrl(flagCode: string): Promise<string | null> {
  if (!hasFlag(flagCode)) {
    return null;
  }

  const cached = flagUrlCache.get(flagCode);
  if (cached) {
    return cached;
  }

  const moduleKey = resolveFlagModuleKey(flagCode);
  if (!moduleKey) {
    return null;
  }

  const loadModule = flagAssetModules[moduleKey];
  const url = await loadModule();
  flagUrlCache.set(flagCode, url);
  return url;
}
