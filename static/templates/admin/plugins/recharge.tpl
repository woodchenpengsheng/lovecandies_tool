<div class="acp-page-container">
	<!-- IMPORT admin/partials/settings/header.tpl -->
	<div class="row m-0">
		<div id="spy-container" class="col-12 col-md-8 px-0 mb-4" tabindex="0">
			<form role="form" class="recharge-settings">
				<div class="mb-4">
					<h5 class="fw-bold tracking-tight settings-header">付费配置区</h5>
					<div class="mb-3">
						<label class="form-label" for="assume-reputation">解锁联系方式消耗的声望值</label>
						<input type="text" id="assume-reputation" name="assume-reputation" title="assume-reputation"
							class="form-control" placeholder="20">
					</div>

					<div class="mb-3">
						<div class="card">
							<div class="card-body">
								<h5 class="card-title">GM直接增加声望接口</h5>
								<label class="form-label">请输入用户的userName</label>
								<input type="text" id="reputation-add-user-name" class="form-control">
								<label class="form-label">请输入增加的声望值</label>
								<input type="text" id="reputation-add-value" class="form-control mb-4">
								<button type="button" class="btn btn-danger" id="start-add-reputation" class="form-control">增加声望</button>
							</div>
						</div>
					</div>
				</div>
				<div class="mb-4">
					<h5 class="fw-bold tracking-tight settings-header">BTC配置区</h5>
					<div class="mb-3">
						<label class="form-label" for="client-id">客户uid</label>
						<input type="text" id="client-id" name="client-id" title="client-id" class="form-control"
							placeholder="请填入用户id标志">
					</div>
					<div class="mb-3">
						<label class="form-label" for="recharge-request-url">交易请求url</label>
						<input type="text" id="recharge-request-url" name="recharge-request-url"
							title="recharge-request-url" class="form-control"
							placeholder="https://www.0123btc.com/otctrade/bargain">
					</div>
					<div class="mb-3">
						<label class="form-label" for="notify-url">交易成功通知url</label>
						<input type="text" id="notify-url" name="notify-url" title="notify-url" class="form-control"
							placeholder="/recharge/notify">
					</div>
					<div class="mb-3">
						<label class="form-label" for="api-key">API KEY</label>
						<input type="text" id="api-key" name="api-key" title="api-key" class="form-control"
							placeholder="vILZUSj9YPDXeGQTJ1ImAOZtC12ec5kR5kAzOcTPY2cHiE0sSCRAzyp90H52L2d6">
					</div>
				</div>

				<div class="mb-4">
					<h5 class="fw-bold tracking-tight settings-header">服务名称列表</h5>

					<div class="mb-3" data-type="sorted-list" data-sorted-list="services-list"
						data-item-template="admin/plugins/recharge/partials/sorted-list/item"
						data-form-template="admin/plugins/recharge/partials/sorted-list/form">
						<ul data-type="list" class="list-group mb-2"></ul>
						<button type="button" data-type="add" class="btn btn-info">增加服务类型</button>
					</div>
				</div>

				<div class="mb-4">
					<h5 class="fw-bold tracking-tight settings-header">Colors</h5>

					<p class="alert" id="preview">
						Here is some preview text. Use the inputs below to modify this alert's appearance.
					</p>
					<div class="mb-3 d-flex gap-2">
						<label class="form-label" for="color">Foreground</label>
						<input data-settings="colorpicker" type="color" id="color" name="color" title="Background Color"
							class="form-control p-1" placeholder="#ffffff" value="#ffffff" style="width: 64px;" />
					</div>
					<div class="mb-3 d-flex gap-2">
						<label class="form-label" for="bgColor">Background</label>
						<input data-settings="colorpicker" type="color" id="bgColor" name="bgColor"
							title="Background Color" class="form-control p-1" placeholder="#000000" value="#000000"
							style="width: 64px;" />
					</div>
				</div>

				<div>
					<h5 class="fw-bold tracking-tight settings-header">Uploads</h5>

					<label class="form-label" for="uploadedImage">Upload Image</label>
					<div class="d-flex gap-1">
						<input id="uploadedImage" name="uploadedImage" type="text" class="form-control" />
						<input value="Upload" data-action="upload" data-target="uploadedImage" type="button"
							class="btn btn-light" />
					</div>
				</div>
			</form>
		</div>

		<!-- IMPORT admin/partials/settings/toc.tpl -->
	</div>
</div>