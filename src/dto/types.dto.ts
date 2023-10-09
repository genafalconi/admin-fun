export enum CategoryDto {
  ALIMENTO_BALANCEADO = 'ALIMENTO BALANCEADO',
  ACCESORIOS = 'ACCESORIOS',
  PIEDRAS = 'PIEDRAS',
  MEDICAMENTO = 'MEDICAMENTO',
}

export enum AnimalDto {
  CAT = 'CAT',
  DOG = 'DOG',
}

export enum AnimalSizeDto {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  MEDIUM_LARGE = 'MEDIUM AND LARGE',
  LARGE = 'LARGE',
  ALL = 'ALL',
}

export enum AnimalAgeDto {
  PUPPY = 'PUPPY',
  ADULT = 'ADULT',
  SENIOR = 'SENIOR',
  ALL = 'ALL',
  KITTEN = 'KITTEN',
}

export enum BrandDto {
  ROYAL_CANIN = 'ROYAL CANIN',
  PRO_PLAN = 'PRO PLAN',
  EXCELLENT = 'EXCELLENT',
  EUKANUBA = 'EUKANUBA',
  IAMS = 'IAMS',
  PEDIGREE = 'PEDIGREE',
  VITAL_CAN = 'VITAL CAN',
  CAN_CAT = 'CAN CAT',
  ABSORSOL = 'ABSORSOL',
  OLD_PRINCE = 'OLD PRINCE',
  BIOPET = 'BIOPET',
  UNIK = 'UNIK',
  OPTIMUM = 'OPTIMUM',
  DOG_CHOW = 'DOG CHOW',
  POWER = 'POWER'
}

export enum StatusOrder {
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  PROCESS = 'PROCESS',
}

export enum PaymentType {
  CASH = 'CASH',
  MP = 'MP',
  TRANSFERENCIA = 'TRANSFERENCIA',
}

export class LandingDto {
  image: string
  type: LandingType
  name: string
  text: string
  active?: boolean
  id?: string
}

export enum LandingType {
  CAROUSEL = 'CAROUSEL',
  INFO = 'INFO',
  PROMO = 'PROMO'
}