import RecoveryPassword from '@/components/RecoveryPassword'

export default function Page({ params }: { params: { link: string } }) {
	return <RecoveryPassword link={params.link} />
}
