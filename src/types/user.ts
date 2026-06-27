export type UserFile = {
  id?: number;
  guid?: string | null;
  fileName?: string | null;
  extension?: string | null;
  size?: number | null;
  data?: string | null;
  url?: string | null;
};

export type UserDetail = {
  id?: number | string;
  guid?: string | null;

  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  userName?: string | null;

  nationalId?: string | null;
  nationalCode?: string | null;
  birthCertificateNo?: string | null;
  fatherName?: string | null;
  attendanceCardNo?: string | null;

  genderId?: number | null;
  birthDate?: string | null;
  issuePlace?: string | null;
  birthPlaceId?: number | null;

  postId?: number | null;
  unitId?: number | null;
  roleId?: number | null;

  hireDate?: string | null;
  workStartDate?: string | null;
  workEndDate?: string | null;

  degreeId?: number | null;
  marriageStatusId?: number | null;
  employementTypeId?: number | null;
  employementGroupId?: number | null;

  shahidChild?: boolean | null;
  janbaz?: boolean | null;
  janbazPercent?: number | string | null;

  phoneNo?: string | null;
  phone?: string | null;
  mobileNo?: string | null;
  mobile?: string | null;
  emailAddress?: string | null;
  address?: string | null;

  bankNumber?: string | null;
  bankId?: number | null;

  reward?: boolean | null;
  enable?: boolean | null;
  status?: string | null;
  description?: string | null;

  imageProfile?: UserFile | string | null;

  password?: string | null;
  keyPass?: string | null;

  [key: string]: any;
};