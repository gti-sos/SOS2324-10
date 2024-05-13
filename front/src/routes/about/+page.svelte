<script>
	const videos = [
		{ src: '/videos/tomlozrom.mp4', title: 'Video tomlozrom' },
		{ src: '/videos/alvsuacar.mp4', title: 'Video alvsuacar' },
		{ src: '/videos/antsuebae.mp4', title: 'Video antsuebae' },
		{ src: '/videos/migrobfer.mp4', title: 'Video migrobfer' }
	];
</script>

<div class="video-container">
	{#each videos as video}
		<div class="video-box">
			<h2>{video.title}</h2>
			<video controls>
				<source type="video/mp4" src={video.src} />
				Your browser does not support the video tag.
			</video>
		</div>
	{/each}
</div>

<style>
	.video-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around; /* Centra los elementos horizontalmente */
		align-items: center; /* Centra los elementos verticalmente */
		height: 100vh; /* Ocupa toda la altura de la pantalla */
	}

	.video-box {
		flex: 0 0 calc(50% - 10px);
		border-radius: 15px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
		margin-bottom: 20px;
		padding: 10px;
		text-align: center; /* Centra el texto de cada vídeo */
	}

	video {
		width: 100%;
		height: auto;
	}
</style>
